import OpenAI from 'openai';

const baseURL = "https://api.groq.com/openai/v1";
// Prefer GROQ_API_KEY, fallback to GOOGLE_API_KEY if not set (legacy implicit support, though URL is changed)
// Actually, let's be strict: we switched to Groq.
const apiKey = process.env.GROQ_API_KEY || process.env.GOOGLE_API_KEY;

if (!apiKey) {
    console.error("CRITICAL: GROQ_API_KEY is missing from environment variables.");
}

export const openai = new OpenAI({
    baseURL,
    apiKey: apiKey,
    defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "EE Teaching Platform",
    },
});

// Priority list: Groq Models (Fastest/Best first)
// User requested: llama3-8b-8192, llama3-70b-8192, mixtral-8x7b-32768, gemma-7b-it
// UPDATE: gemma-7b-it is decommissioned (400 Error). Swapping to modern equivalents.
const MODELS = [
    "llama-3.3-70b-versatile", // Newest Llama 3.3
    "llama-3.1-8b-instant",    // Fast & Reliable
    "mixtral-8x7b-32768",      // Stable Legacy
    "gemma2-9b-it"             // Google's Open Model (Replacing decommissioned gemma-7b)
];

export async function robustChatCompletion(params: any): Promise<{ content: string | null, model: string }> {
    let lastError: any = null;

    for (const model of MODELS) {
        try {
            console.log(`[AI Client] Attempting request with model: ${model}`);

            const response = await openai.chat.completions.create({
                ...params,
                model: model,
            });

            const content = response.choices[0].message.content;

            // Add metadata about which model was actually used
            console.log(`[AI Client] Success with ${model}`);
            return { content, model };

        } catch (error: any) {
            console.warn(`[AI Client] Model ${model} failed. Error:`, error.message || error);
            lastError = error;

            // Check for Rate Limit or overload errors specific to Google/OpenAI
            // 429: Too Many Requests
            // 503: Service Unavailable (often capacity)
            // 500: Internal Server Error (sometimes happens with overloaded models)
            const isRateLimit = error.status === 429 || error.status === 503 || error.code === 'resource_exhausted';

            if (isRateLimit) {
                console.log(`[AI Client] Rate limit hit for ${model}. Switching to next model...`);
                continue; // Try next model
            }

            // If it's a completely different error (e.g. invalid format), maybe we should still try fallback?
            // For safety, let's treat most API errors as "try next".
            console.log(`[AI Client] Non-standard error for ${model}. Switching to next model just in case...`);
            continue;
        }
    }

    // If we run out of models
    console.error("[AI Client] All models failed.");
    throw lastError || new Error("All AI models failed to respond.");
}
