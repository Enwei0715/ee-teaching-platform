export interface Quiz {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    model?: string;
}

export async function generateQuiz(courseSlug: string, lessonSlug: string): Promise<Quiz> {
    const response = await fetch('/api/llm/quiz', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseSlug, lessonSlug }),
    });

    if (!response.ok) {
        throw new Error('Failed to generate quiz');
    }

    return response.json();
}

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export async function askQuestion(messages: ChatMessage[], context: string, lessonContext?: any): Promise<string> {
    const response = await fetch('/api/llm/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages, context, lessonContext }),
    });

    if (!response.ok) {
        throw new Error('Failed to get answer');
    }

    const data = await response.json();
    return data.reply;
}
