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
        const { messages, context, lessonContext } = body;

        console.log("AI Context Received:", lessonContext ? "YES" : "NO");
        if (lessonContext) {
            console.log("Context Title:", lessonContext.lessonTitle);
            console.log("Context Snippet:", lessonContext.content.substring(0, 100));
        }

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
        }

        let systemPrompt;
        if (lessonContext) {
            const { courseTitle, lessonTitle, content } = lessonContext;
            systemPrompt = `
    You are an AI Teaching Assistant strictly for the course: "${courseTitle}".
    The user is currently studying the lesson: "${lessonTitle}".

    '''LESSON CONTENT START'''
    ${content}
    '''LESSON CONTENT END'''

    INSTRUCTIONS:
    1. Answer the user's question based **EXCLUSIVELY** on the "LESSON CONTENT" provided above.
    2. If the user asks for a definition (e.g., "What is CUS?"), check the lesson content first. If it is defined there (e.g., "Constant Utilization Server"), you **MUST** use that definition.
    3. **DO NOT** use outside knowledge or general definitions if they conflict with the lesson content.
    4. Only use general knowledge if the answer is NOT found in the text, but you must preface it with: "This is not mentioned in the current lesson, but generally speaking..."
    5. **FORMATTING**: Use clear Markdown. Use bold for key terms. Use bullet points for lists. Keep paragraphs concise.
    `;
        } else {
            systemPrompt = context && context.trim() !== "General context: The user is asking questions about electronics engineering."
                ? `You are a helpful physics and engineering tutor.
${context}

Answer the student's questions clearly and concisely with reference to the lesson content when relevant.
Focus on explaining concepts in an educational way. Use examples and analogies to aid understanding.
If the question is about specific content in the lesson, quote or reference it directly.`
                : `You are a helpful physics and engineering tutor.
Answer the student's questions clearly and concisely about electronics, physics, and engineering topics.
Focus on explaining concepts in an educational way. Use examples and analogies to aid understanding.`;
        }

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
