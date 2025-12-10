import OpenAI from 'openai';

const baseURL = "https://generativelanguage.googleapis.com/v1beta/openai/";
const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
    console.error("CRITICAL: GOOGLE_API_KEY is missing from environment variables.");
}

export const openai = new OpenAI({
    baseURL,
    apiKey: apiKey,
    defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "EE Teaching Platform",
    },
});

// Priority list: Primary -> Fallback
const MODELS = ["gemini-2.5-flash", "gemini-1.5-flash"];

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
