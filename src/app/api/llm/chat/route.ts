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

        const systemPrompt = `You are a helpful physics and engineering tutor. 
The student is asking a follow-up question about a quiz problem they just solved.
Here is the context of the problem:
${context}

Answer the student's question clearly and concisely. 
Focus on explaining the concepts related to the problem.
Do not give away answers to other potential questions if not asked.`;

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
