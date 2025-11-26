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
        const { messages, context } = body;

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
        }

        const systemPrompt = context && context.trim() !== "General context: The user is asking questions about electronics engineering."
            ? `You are a helpful physics and engineering tutor.
${context}

Answer the student's questions clearly and concisely with reference to the lesson content when relevant.
Focus on explaining concepts in an educational way. Use examples and analogies to aid understanding.
If the question is about specific content in the lesson, quote or reference it directly.`
            : `You are a helpful physics and engineering tutor.
Answer the student's questions clearly and concisely about electronics, physics, and engineering topics.
Focus on explaining concepts in an educational way. Use examples and analogies to aid understanding.`;

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                ...messages
            ],
            model: "gemini-2.5-flash",
        });

        const reply = completion.choices[0].message.content;
        console.log("AI Tutor Reply:", reply);
        return NextResponse.json({ reply });

    } catch (error) {
        console.error('Error in chat:', error);
        return NextResponse.json({ error: 'Failed to process chat request', details: String(error) }, { status: 500 });
    }
}
