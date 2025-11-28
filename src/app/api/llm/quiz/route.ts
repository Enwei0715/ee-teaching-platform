import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import prisma from '@/lib/prisma';

const openai = new OpenAI({
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    apiKey: process.env.GOOGLE_API_KEY,
    defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "EE Teaching Platform",
    },
});

interface Section {
    title: string;
    content: string;
}

/**
 * Calculates a "Quiz Worthiness" score for a section.
 * Higher score = better content for generating questions.
 */
function calculateScore(section: { title: string, content: string }): number {
    const { title, content } = section;

    // 1. Instant Disqualification (Blocklist)
    // Filter out structural or low-value sections
    const blocklist = ['reference', 'summary', 'conclusion', 'intro', 'setup', 'install', 'prerequisite', '參考', '結語', '小結', '前言'];
    if (blocklist.some(term => title.toLowerCase().includes(term))) {
        return 0;
    }

    // 2. Strip Noise to find "Real Content"
    // Remove code blocks, images, and links to evaluate the actual explanatory text
    const textOnly = content
        .replace(/```[\s\S]*?```/g, "") // Remove code blocks
        .replace(/!\[.*?\]\(.*?\)/g, "") // Remove images
        .replace(/\[.*?\]\(.*?\)/g, ""); // Remove links

    // Filter out sections with very little actual text (e.g., just a header and an image)
    if (textOnly.trim().length < 150) {
        return 0;
    }

    // 3. Calculate Base Score
    let score = textOnly.length;

    // 4. Bonus Points for Explanatory Keywords
    // These words suggest the section contains definitions, reasons, or examples
    const keywords = ['because', 'means', 'example', 'however', 'therefore', 'defined as', '定義', '例如', '因此', '原理', '因為'];
    keywords.forEach(word => {
        if (textOnly.toLowerCase().includes(word)) {
            score += 50;
        }
    });

    return score;
}

/**
 * Extracts a high-quality random section from markdown content using heuristic scoring.
 */
function extractRandomSection(markdown: string): Section {
    // Split by H2 or H3 headers (## or ###)
    const sectionsRaw = markdown.split(/(?=\n#{2,3}\s)/);

    // Map sections to objects and calculate scores
    const scoredSections = sectionsRaw.map(raw => {
        const titleMatch = raw.match(/^\n?#{2,3}\s+(.+)/);
        const title = titleMatch ? titleMatch[1].trim() : "Main Content";
        return {
            title,
            content: raw,
            score: calculateScore({ title, content: raw })
        };
    });

    // Filter out zero-score sections
    const validSections = scoredSections.filter(s => s.score > 0);

    // Fallback: If no sections pass the filter, use the highest scoring one (even if 0) or the longest
    if (validSections.length === 0) {
        // Sort by length descending as a last resort
        const longestSection = scoredSections.sort((a, b) => b.content.length - a.content.length)[0];

        if (!longestSection || longestSection.content.length < 50) {
            return { title: "Full Lesson", content: markdown };
        }
        return { title: longestSection.title, content: longestSection.content };
    }

    // Sort by score descending
    validSections.sort((a, b) => b.score - a.score);

    // Select from the "Top Tier"
    // Take the top 30% or top 3, whichever is larger, to ensure variety among good sections
    const topTierCount = Math.max(3, Math.ceil(validSections.length * 0.3));
    const topTier = validSections.slice(0, topTierCount);

    // Randomly pick one from the top tier
    const randomIndex = Math.floor(Math.random() * topTier.length);
    const selectedSection = topTier[randomIndex];

    console.log(`Quiz Selection: Picked "${selectedSection.title}" (Score: ${selectedSection.score}) from ${validSections.length} candidates.`);

    return { title: selectedSection.title, content: selectedSection.content };
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log("API Request Body:", body);
        const { courseSlug, lessonSlug, sectionContent, sectionTitle } = body;

        if (!courseSlug || !lessonSlug) {
            return NextResponse.json({ error: 'Course slug and lesson slug are required' }, { status: 400 });
        }

        // If sectionContent is provided (from progress-aware quiz), use it directly
        if (sectionContent && sectionTitle) {
            console.log(`Using provided section: "${sectionTitle}"`);

            try {
                const completion = await openai.chat.completions.create({
                    messages: [
                        {
                            role: "system",
                            content: `Role: You are an expert Electronics Engineering Professor creating exam questions.

**CURRENT FOCUS SECTION:** "${sectionTitle}"

Task: Generate ONE multiple-choice question based EXCLUSIVELY on the content from this specific section.
Do NOT ask about other parts of the lesson. Focus deeply on specific details, formulas, or concepts found ONLY in the provided section text.

Output Format (Strict JSON):
You must output valid JSON only. No conversational text before or after.
Structure:
{
  "question": "The question text here. Use LaTeX $...$ for math.",
  "options": [
    "Option A text",
    "Option B text",
    "Option C text",
    "Option D text"
  ],
  "correctAnswerIndex": 2, // 0-based index (0=A, 1=B, 2=C, 3=D)
  "explanation": "Detailed explanation here. Use LaTeX $...$ for math formulas. Explain why the correct answer is right and others are wrong."
}

=== CRITICAL RULES ===
1. **RANDOMIZATION**: You MUST randomize the position of the correct answer. Do NOT always place it in the same position (e.g., do not always make 'C' correct). Ensure an even distribution of correct answers across A, B, C, and D.
2. **Math & LaTeX Formatting:**
   - ALL math MUST be in $...$ or $$...$$
   - Code/variables: Always use $\\texttt{name}$ inside math delimiters
   - Units: $10^{16}\\ \\text{cm}^{-3}$ - wrap \\text{} in $...$
3. **Language:** Traditional Chinese for questions, English for technical terms
4. **Quality:** Test understanding, not just recall

REMEMBER: Wrap \\texttt{}, \\text{}, \\mathrm{} in $...$!
`,
                        },
                        {
                            role: "user",
                            content: `
Section: ${sectionTitle}
Timestamp: ${Date.now()} (Use this to ensure uniqueness)

Content:
"""
${sectionContent}
"""

Generate a unique quiz question based on THIS section only.
`
                        }
                    ],
                    model: "gemini-2.5-flash",
                    response_format: { type: "json_object" },
                    temperature: 1.0,
                });

                const content = completion.choices[0].message.content;
                if (!content) {
                    throw new Error("No content received from LLM");
                }

                const quiz = JSON.parse(content);
                if (typeof quiz.correctAnswerIndex === 'number') {
                    quiz.correctAnswer = quiz.correctAnswerIndex;
                }

                return NextResponse.json({
                    ...quiz,
                    model: "gemini-2.5-flash",
                    sectionTitle: sectionTitle
                });
            } catch (aiError) {
                console.error("AI Generation Failed:", aiError);
                return NextResponse.json({ error: 'Failed to generate quiz', details: String(aiError) }, { status: 500 });
            }
        }

        // Original behavior: Fetch lesson from DB and extract random section
        const lesson = await prisma.lesson.findFirst({
            where: {
                slug: lessonSlug,
                course: {
                    slug: courseSlug
                }
            },
            select: {
                title: true,
                content: true,
                questions: true
            }
        });

        if (!lesson) {
            return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
        }

        try {
            console.log("Calling Google AI Studio with lesson content...");

            // CRITICAL: Extract random section to ensure variety
            const { title: sectionTitle, content: sectionContent } = extractRandomSection(lesson.content);
            console.log(`Selected section: "${sectionTitle}" (${sectionContent.length} chars)`);

            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `Role: You are an expert Electronics Engineering Professor creating exam questions.

**CURRENT FOCUS SECTION:** "${sectionTitle}"

Task: Generate ONE multiple-choice question based EXCLUSIVELY on the content from this specific section.
Do NOT ask about other parts of the lesson. Focus deeply on specific details, formulas, or concepts found ONLY in the provided section text.

Output Format (Strict JSON):
You must output valid JSON only. No conversational text before or after.
Structure:
{
  "question": "The question text here. Use LaTeX $...$ for math.",
  "options": [
    "Option A text",
    "Option B text",
    "Option C text",
    "Option D text"
  ],
  "correctAnswerIndex": 2, // 0-based index (0=A, 1=B, 2=C, 3=D)
  "explanation": "Detailed explanation here. Use LaTeX $...$ for math formulas. Explain why the correct answer is right and others are wrong."
}

Content Rules:
1. **RANDOMIZATION**: You MUST randomize the position of the correct answer. Do NOT always place it in the same position. Ensure an even distribution across A, B, C, D.
2. **Math & Code Formatting:**
   - Numbers and formulas: Use math mode. Example: $N_d = 10^{16} \\text{ cm}^{-3}$
   - Code/functions: Use $\\texttt{functionName()}$ for code terms
   - Variables in text: Use $\\texttt{variableName}$ 
   - NEVER use \\texttt{} outside of $...$ delimiters
3. Difficulty: Match the level of the provided content.
4. Language: Traditional Chinese (繁體中文) for text, English for standard terminology if applicable.
5. **CRITICAL - SPECIFICITY**: 
   - Ask about a specific detail, formula, calculation, or concept from THIS section.
   - Avoid generic "What is X?" questions. Prefer "How does X affect Y?" or "Calculate Z given...".
   - Test understanding, not just memorization.`
                    },
                    {
                        role: "user",
                        content: `
Lesson: ${lesson.title}
Focused Section: ${sectionTitle}
Timestamp: ${Date.now()} (Use this to ensure uniqueness)

Section Content:
"""
${sectionContent}
"""

Generate a unique and challenging question that tests a specific concept from THIS section.
Focus on details that require understanding, not just recall.
                        `
                    }
                ],
                model: "gemini-2.5-flash",
                response_format: { type: "json_object" },
                temperature: 1.0, // High temperature for variety
            });

            console.log("Google AI Response:", completion);
            const content = completion.choices[0].message.content;
            console.log("Google AI Response Content:", content);

            if (!content) {
                throw new Error("No content received from LLM");
            }

            const quiz = JSON.parse(content);

            // Map correctAnswerIndex to correctAnswer for frontend compatibility
            if (typeof quiz.correctAnswerIndex === 'number') {
                quiz.correctAnswer = quiz.correctAnswerIndex;
            }

            return NextResponse.json({
                ...quiz,
                model: "gemini-2.5-flash",
                sectionTitle: sectionTitle  // Include which section was tested
            });

        } catch (aiError) {
            console.error("AI Generation Failed:", aiError);

            // 3. Fallback: Use a random question from the database
            if (lesson.questions && lesson.questions.length > 0) {
                console.log("Using fallback question from database.");
                const backupQuestion = lesson.questions[Math.floor(Math.random() * lesson.questions.length)];

                return NextResponse.json({
                    question: backupQuestion.question,
                    options: backupQuestion.options,
                    correctAnswer: backupQuestion.correctAnswer,
                    explanation: backupQuestion.explanation || "Standard database question.",
                    model: "Database Fallback"
                });
            }

            return NextResponse.json({ error: 'Failed to generate quiz and no backup available', details: String(aiError) }, { status: 500 });
        }

    } catch (error) {
        console.error('Error in quiz API:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: String(error) }, { status: 500 });
    }
}
