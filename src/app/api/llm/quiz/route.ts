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
        const { topic } = body;

        if (!topic) {
            console.error("Topic missing");
            return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
        }

        console.log("Calling Google AI Studio with topic:", topic);
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a helpful physics and engineering tutor. Generate a unique and diverse multiple-choice question about the given topic. Focus on different aspects such as conceptual understanding, practical application, or calculation. Avoid repeating common questions. Return the response in strictly valid JSON format with the following structure: { \"question\": \"string\", \"options\": [\"string\", \"string\", \"string\", \"string\"], \"correctAnswer\": number (0-3), \"explanation\": \"string\" }."
                },
                {
                    role: "user",
                    content: `Generate a quiz question about: ${topic}. Ensure it is distinct from typical questions on this topic.`
                }
            ],
            model: "gemini-2.5-flash",
            response_format: { type: "json_object" },
            temperature: 0.7,
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
