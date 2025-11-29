export interface Quiz {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    model?: string;
    sectionTitle?: string;
}

export async function generateQuiz(courseSlug: string, lessonSlug: string, sectionContent?: string, sectionTitle?: string): Promise<Quiz> {
    const response = await fetch('/api/llm/quiz', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseSlug, lessonSlug, sectionContent, sectionTitle }),
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

export async function askQuestion(messages: ChatMessage[], lessonContext?: any): Promise<string> {
    const response = await fetch('/api/llm/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages, lessonContext }),
    });

    if (!response.ok) {
        throw new Error('Failed to get answer');
    }

    const data = await response.json();
    return data.reply;
}
