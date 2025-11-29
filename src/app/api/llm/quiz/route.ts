import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { parseSections, scopeSections, scoreSections, selectBestSection } from '@/lib/ai/quiz-algorithm';
import prisma from '@/lib/prisma';

const openai = new OpenAI({
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    apiKey: process.env.GOOGLE_API_KEY,
    defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "EE Teaching Platform",
    },
});

// Helper to extract a random section from markdown content
function extractRandomSection(content: string): { title: string, content: string } {
    // Split by headers (H1, H2, H3)
    const sections = content.split(/^#{1,3}\s+(.+)$/gm);

    // The split results in [preamble, title1, content1, title2, content2, ...]
    // We want to pair titles with content
    const parsedSections: { title: string, content: string }[] = [];

    for (let i = 1; i < sections.length; i += 2) {
        const title = sections[i].trim();
        const body = sections[i + 1].trim();

        // Filter out empty or too short sections, or "Summary"/"Conclusion"
        if (body.length > 200 && !title.toLowerCase().includes('summary') && !title.toLowerCase().includes('conclusion')) {
            parsedSections.push({ title, content: body });
        }
    }

    if (parsedSections.length === 0) {
        // Fallback: just return a chunk of the content
        return { title: "General Content", content: content.substring(0, 2000) };
    }

    // Pick a random section
    const randomIndex = Math.floor(Math.random() * parsedSections.length);
    return parsedSections[randomIndex];
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { courseSlug, lessonSlug, sectionContent, sectionTitle } = body;

        if (!courseSlug || !lessonSlug) {
            return NextResponse.json({ error: 'Course slug and lesson slug are required' }, { status: 400 });
        }

        // Check if we have direct section content (from frontend selection)
        if (sectionContent && sectionTitle) {
            console.log(`Generating quiz for specific section: "${sectionTitle}"`);

            try {
                const completion = await openai.chat.completions.create({
                    messages: [
                        {
                            role: "system",
                            content: String.raw`Role: You are an expert Exam Creator for Electronic Engineering.
Your goal is to test the user's deep understanding of the provided lesson context.

**CURRENT FOCUS SECTION:** "${sectionTitle}"

Task: Generate ONE multiple-choice question based EXCLUSIVELY on the content from this specific section.

Output Format (Strict JSON):
{
  "question": "The question text here. Use LaTeX $...$ for math.",
  "options": [
    "Option A text",
    "Option B text",
    "Option C text",
    "Option D text"
  ],
  "correctAnswerIndex": 2, // 0-based index (0=A, 1=B, 2=C, 3=D)
  "explanation": "Detailed explanation here. Use LaTeX $...$ for math formulas. Explain the concept directly."
}

=== GENERATION RULES ===

1. **RANDOMIZATION (CRITICAL):**
   - You MUST randomize the position of the correct answer.
   - Do NOT always place the correct answer in the first or second slot.
   - Ensure an even distribution of correct answers across indices 0, 1, 2, and 3.

2. **EXPLANATION STYLE:**
   - The \`explanation\` field MUST be **Option-Agnostic**.
   - **FORBIDDEN:** Do NOT refer to "Option A", "The second option", or "The correct answer is...".
   - **REQUIRED:** Explain the *concept* directly. (e.g., "Voltage is potential difference because...")

3. **CRITICAL JSON & FORMATTING RULES:**
   - **NO \`\\texttt\`:** NEVER use the LaTeX command \`\\texttt{...}\`. It breaks JSON parsing (interpreted as a tab character).
     - BAD: \`\\texttt{Si}\`
     - GOOD (Markdown Code): \`Si\` (wrapped in backticks)
     - GOOD (Math Roman): \`$\\mathrm{Si}$\`
   - **DOUBLE ESCAPE BACKSLASHES:** Inside the JSON string, ALL backslashes must be escaped.
     - BAD: \`"unit": "$\\text{V}$"\`
     - GOOD: \`"unit": "$\\\\text{V}$"\`
   - **MDX MATH COMPATIBILITY:**
     - Use ONLY single \`$\` for inline math and double \`$$\` for block math.
     - **FORBIDDEN:** \`\\(\`, \`\\)\`, \`\\[\`, \`\\]\`.

4. **LANGUAGE:**
   - **Questions/Options:** Traditional Chinese (繁體中文).
   - **Technical Terms:** Keep key terms in English (e.g., "Threshold Voltage", "PCB").

5. **QUALITY CONTROL:**
   - Questions must be based **EXCLUSIVELY** on the provided lesson context.
   - Ignore "fluff" content like introductions, summaries, or video placeholders. Focus on definitions, formulas, and logic.
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
                        content: String.raw`Role: You are an expert Exam Creator for Electronic Engineering.
Your goal is to test the user's deep understanding of the provided lesson context.

**CURRENT FOCUS SECTION:** "${sectionTitle}"

Task: Generate ONE multiple-choice question based EXCLUSIVELY on the content from this specific section.

Output Format (Strict JSON):
{
  "question": "The question text here. Use LaTeX $...$ for math.",
  "options": [
    "Option A text",
    "Option B text",
    "Option C text",
    "Option D text"
  ],
  "correctAnswerIndex": 2, // 0-based index (0=A, 1=B, 2=C, 3=D)
  "explanation": "Detailed explanation here. Use LaTeX $...$ for math formulas. Explain the concept directly."
}

=== GENERATION RULES ===

1. **RANDOMIZATION (CRITICAL):**
   - You MUST randomize the position of the correct answer.
   - Do NOT always place the correct answer in the first or second slot.
   - Ensure an even distribution of correct answers across indices 0, 1, 2, and 3.

2. **EXPLANATION STYLE:**
   - The \`explanation\` field MUST be **Option-Agnostic**.
   - **FORBIDDEN:** Do NOT refer to "Option A", "The second option", or "The correct answer is...".
   - **REQUIRED:** Explain the *concept* directly. (e.g., "Voltage is potential difference because...")

3. **CRITICAL JSON & FORMATTING RULES:**
   - **NO \`\\texttt\`:** NEVER use the LaTeX command \`\\texttt{...}\`. It breaks JSON parsing (interpreted as a tab character).
     - BAD: \`\\texttt{Si}\`
     - GOOD (Markdown Code): \`Si\` (wrapped in backticks)
     - GOOD (Math Roman): \`$\\mathrm{Si}$\`
   - **DOUBLE ESCAPE BACKSLASHES:** Inside the JSON string, ALL backslashes must be escaped.
     - BAD: \`"unit": "$\\text{V}$"\`
     - GOOD: \`"unit": "$\\\\text{V}$"\`
   - **MDX MATH COMPATIBILITY:**
     - Use ONLY single \`$\` for inline math and double \`$$\` for block math.
     - **FORBIDDEN:** \`\\(\`, \`\\)\`, \`\\[\`, \`\\]\`.

4. **LANGUAGE:**
   - **Questions/Options:** Traditional Chinese (繁體中文).
   - **Technical Terms:** Keep key terms in English (e.g., "Threshold Voltage", "PCB").

5. **QUALITY CONTROL:**
   - Questions must be based **EXCLUSIVELY** on the provided lesson context.
   - Ignore "fluff" content like introductions, summaries, or video placeholders. Focus on definitions, formulas, and logic.
`,
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

            // ... (rest of the response handling logic) ...

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
