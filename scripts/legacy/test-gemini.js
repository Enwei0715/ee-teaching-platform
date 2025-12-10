const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = envContent.split('\n').reduce((acc, line) => {
    const [key, value] = line.split('=');
    if (key && value) {
        acc[key.trim()] = value.trim();
    }
    return acc;
}, {});

const apiKey = envVars.GOOGLE_API_KEY;

async function main() {
    // Test with valid model
    console.log("Testing with gemini-1.5-flash...");
    await testUrl("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", "gemini-1.5-flash");
}

async function testUrl(url, model) {
    console.log(`Testing URL: ${url} with model: ${model}`);
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: "Hello!" },
                ],
            })
        });

        console.log(`Status: ${response.status}`);
        const text = await response.text();
        console.log(`Response: ${text.substring(0, 200)}...`);
    } catch (error) {
        console.error("Error:", error);
    }
}

main();
