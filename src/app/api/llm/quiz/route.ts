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
                    content: `You are a strict teacher assistant. All questions must be based ONLY on the facts provided in the lessonContent below. Do not introduce outside information.
                    
                    Ensure DIVERSITY in your questions. Do NOT generate multiple questions that test the exactly same specific fact, keyword, or definition. Cover different paragraphs and concepts from the text.
                    
                    Aim for a mix of conceptual understanding questions and specific detail recall questions, but ensure every question is distinct.
                    
                    Return the response in strictly valid JSON format with the following structure: { "question": "string", "options": ["string", "string", "string", "string"], "correctAnswer": number (0-3), "explanation": "string" }.`
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

        console.log("Google AI Response:", completion);
        const content = completion.choices[0].message.content;
        if (!content) {
            throw new Error("No content received from LLM");
        }

        const quiz = JSON.parse(content);
        return NextResponse.json({ ...quiz, model: "gemini-2.5-flash" });

    } catch (error) {
        console.error('Error generating quiz:', error);
        return NextResponse.json({ error: 'Failed to generate quiz', details: String(error) }, { status: 500 });
    }
}
