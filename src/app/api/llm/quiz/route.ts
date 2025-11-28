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
 * Extracts a random section from markdown content based on H2/H3 headings.
 * This ensures quiz questions focus on different parts of the lesson.
 */
function extractRandomSection(markdown: string): Section {
    // Split by H2 or H3 headers (## or ###)
    // Lookahead keeps the heading in the section content
    const sections = markdown.split(/(?=\n#{2,3}\s)/);

    // Filter sections with meaningful content (>200 chars)
    // This avoids testing on just a heading or very short intro
    const validSections = sections.filter(s => s.trim().length > 200);

    // Fallback for short lessons or lessons without headers
    if (validSections.length === 0) {
        return { title: "Full Lesson", content: markdown };
    }

    // Random selection for variety
    const randomIndex = Math.floor(Math.random() * validSections.length);
    const selectedContent = validSections[randomIndex];

    // Extract heading title for UI display
    const titleMatch = selectedContent.match(/^\n?#{2,3}\s+(.+)/);
    const title = titleMatch ? titleMatch[1].trim() : "Selected Section";

    return { title, content: selectedContent };
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log("API Request Body:", body);
        const { courseSlug, lessonSlug } = body;

        if (!courseSlug || !lessonSlug) {
            return NextResponse.json({ error: 'Course slug and lesson slug are required' }, { status: 400 });
        }

        // 1. Fetch Lesson Content from DB using slugs
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
    "Option A text (incorrect)",
    "Option B text (incorrect)",
    "Option C text (correct answer)",
    "Option D text (incorrect)"
  ],
  "correctAnswerIndex": 2, // 0-based index (0=A, 1=B, 2=C, 3=D)
  "explanation": "Detailed explanation here. Use LaTeX $...$ for math formulas. Explain why the correct answer is right and others are wrong."
}

Content Rules:
1. **Math & Code Formatting:**
   - Numbers and formulas: Use math mode. Example: $N_d = 10^{16} \\text{ cm}^{-3}$
   - Code/functions: Use $\\texttt{functionName()}$ for code terms
   - Variables in text: Use $\\texttt{variableName}$ 
   - NEVER use \\texttt{} outside of $...$ delimiters
2. Difficulty: Match the level of the provided content.
3. Language: Traditional Chinese (繁體中文) for text, English for standard terminology if applicable.
4. **CRITICAL - SPECIFICITY**: 
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
