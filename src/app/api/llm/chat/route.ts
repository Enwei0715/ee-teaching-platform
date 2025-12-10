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
        const { messages, lessonContext } = body;

        console.log("AI Context Received:", lessonContext ? "YES" : "NO");
        if (lessonContext) {
            console.log("Context Title:", lessonContext.lessonTitle);
            console.log("Context Length:", lessonContext.content?.length || 0, "characters");
        }

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
        }

        let systemPrompt;
        if (lessonContext && lessonContext.content) {
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
5. If referencing specific parts of the lesson, quote them directly.
6. Always relate your answers back to the lesson content when possible.
7. **LANGUAGE**: Detect the primary language of the "LESSON CONTENT". You **MUST** answer in the SAME language as the lesson content, unless the user explicitly asks to answer in a different language.

=== MDX SYNTAX RULES (CRITICAL - MUST FOLLOW) ===

**Math & LaTeX Formatting (MOST IMPORTANT):**
- ALL math expressions MUST be wrapped in $...$ (inline) or $$...$$ (block)
- Code/function names: $\\texttt{functionName()}$ - ALWAYS wrap \\texttt{} in $...$
- Variables: $\\texttt{variableName}$ - ALWAYS wrap \\texttt{} in $...$
- Units: $10^{16}\\ \\text{cm}^{-3}$ or $5\\ \\mathrm{V}$ - ALWAYS wrap \\text{} or \\mathrm{} in $...$
- Text in formulas: $F = ma\\ \\text{(Newton's second law)}$
- **NEVER** use \\texttt{}, \\text{}, or \\mathrm{} outside of $...$ delimiters
- **NEVER** use single backticks (\`) for code - use $\\texttt{}$ instead

**Correct Examples:**
✅ $\\texttt{mutex}$ - function/code name
✅ $\\texttt{HP}$ - variable name
✅ $N_d = 10^{16}\\ \\text{cm}^{-3}$ - number with unit
✅ $V_{GS} = 2\\ \\mathrm{V}$ - voltage
✅ $I_D = 5\\ \\mathrm{mA}$ - current

**Wrong Examples (DO NOT USE):**
❌ exttt{mutex} - missing $ delimiters and backslash
❌ \\texttt{HP} - missing $ delimiters
❌ \`code\` - backticks not allowed
❌ 10^16 cm^-3 - missing $ delimiters
❌ \\text{unit} outside math mode - missing $ delimiters

**Text Formatting:**
- Bold: **重要文字**
- Italic: *強調文字*
- Lists: Use - or * for bullet points, 1. 2. 3. for numbered lists
- DO NOT use HTML tags

**FORMATTING**: Use clear Markdown with proper MDX syntax. Use bold for key terms. Use bullet points for lists. Keep paragraphs concise.

REMEMBER: Every time you write \\texttt{}, \\text{}, or \\mathrm{}, wrap it in $...$!
            `.trim();
        } else {
            // Fallback for when no lesson context is available
            systemPrompt = `You are a helpful physics and engineering tutor.
Answer the student's questions clearly and concisely about electronics, physics, and engineering topics.
Focus on explaining concepts in an educational way. Use examples and analogies to aid understanding.
Use clear Markdown formatting with bold for key terms and bullet points for lists.`;
        }

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                ...messages
            ],
            model: "gemini-1.5-flash",
        });

        const reply = completion.choices[0].message.content;
        console.log("AI Tutor Reply Length:", reply?.length || 0);
        return NextResponse.json({ reply });

    } catch (error) {
        console.error('Error in chat:', error);
        return NextResponse.json({ error: 'Failed to process chat request', details: String(error) }, { status: 500 });
    }
}
