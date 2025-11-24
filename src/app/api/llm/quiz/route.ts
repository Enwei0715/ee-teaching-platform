import { NextResponse } from 'next/server';
import OpenAI from 'openai';

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
        const { topic, context } = body;

        if (!topic) {
            console.error("Topic missing");
            return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
        }

        console.log("Calling Google AI Studio with topic:", topic);
        const focusAngles = [
            'Conceptual Understanding',
            'Real-world Application',
            'Common Mistakes',
            'Calculation/Analysis',
            'Specific Detail Recall'
        ];
        const randomFocus = focusAngles[Math.floor(Math.random() * focusAngles.length)];

        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `Role: You are an expert Electronics Engineering Professor creating exam questions.
Task: Generate a single multiple-choice question based on the provided topic or content context.

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
3. Language: Traditional Chinese (繁體中文) for text, English for standard terminology if applicable.`
                },
                {
                    role: "user",
                    content: `Generate a multiple-choice question about: ${topic}.
                    
                    Focus strictly on this angle: ${randomFocus}.
                    
                    Lesson Content:
                    ${context ? context.substring(0, 2000) : 'No specific context provided. Generate a standard question based on the topic.'}`
                }
            ],
            model: "gemini-2.5-flash",
            response_format: { type: "json_object" },
            temperature: 0.5,
        });

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

    } catch (error) {
        console.error('Error generating quiz:', error);
        return NextResponse.json({ error: 'Failed to generate quiz', details: String(error) }, { status: 500 });
    }
}
