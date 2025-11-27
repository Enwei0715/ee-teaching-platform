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

            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `Role: You are an expert Electronics Engineering Professor creating exam questions.
Task: Generate a single multiple-choice question based STRICTLY on the provided lesson content.

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
1. Math: ALWAYS use LaTeX format for numbers and variables. Example: $N_d = 10^{16} \\text{ cm}^{-3}$, not 10^16.
2. Difficulty: Match the level of the provided content.
3. Language: Traditional Chinese (繁體中文) for text, English for standard terminology if applicable.
4. **VARIETY**: Randomly select a specific section, concept, or detail from the lesson content to generate the question. **DO NOT** always pick the first topic or the main heading. Try to find obscure or specific details to test deep understanding.`
                    },
                    {
                        role: "user",
                        content: `
                        Lesson Title: ${lesson.title}
                        Lesson Content:
                        """
                        ${lesson.content.slice(0, 100000)}
                        """
                        
                        Generate a unique and challenging question that tests a specific concept mentioned in this text. Avoid generic questions.
                        `
                    }
                ],
                model: "gemini-2.5-flash",
                response_format: { type: "json_object" },
                temperature: 0.7, // Increased temperature for more variety
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

            return NextResponse.json({ ...quiz, model: "gemini-2.5-flash" });

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
