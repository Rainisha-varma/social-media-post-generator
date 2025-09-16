require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const path = require('path');

// Import the GoogleGenerativeAI class directly
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3000;

// Initialize Gemini client
if (!process.env.GEMINI_API_KEY) {
    console.error("Error: GEMINI_API_KEY environment variable is not set.");
    process.exit(1);
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Prefer flash (faster), fallback to pro if needed
const flashModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const proModel = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

// Middleware to serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON request bodies
app.use(express.json());

// Helper: Try generating with retries + fallback
async function generateWithRetries(model, prompt, retries = 3) {
    while (retries > 0) {
        try {
            const result = await model.generateContent(prompt);
            return result.response.text();
        } catch (err) {
            if (err.message.includes("503") && retries > 1) {
                console.warn("Model overloaded, retrying in 2s...");
                await new Promise(r => setTimeout(r, 2000));
                retries--;
            } else {
                throw err;
            }
        }
    }
}

// API endpoint for generating social media posts
app.post('/generate-post', async (req, res) => {
    const { topic, tone, platform, addHashtags, addEmojis } = req.body;

    if (!topic) {
        return res.status(400).json({ error: 'Topic is required.' });
    }

    // Build the prompt
    let prompt = `Generate a compelling social media post.`;
    prompt += ` The main subject is "${topic}".`;

    if (tone && tone !== 'Any') {
        prompt += ` The tone should be ${tone}.`;
    }
    if (platform && platform !== 'Any') {
        prompt += ` It's specifically tailored for ${platform}.`;
    }
    if (addEmojis) {
        prompt += ` Please include relevant and engaging emojis.`;
    } else {
        prompt += ` Strictly do not include any emojis.`;
    }
    if (addHashtags) {
        prompt += ` Also, add appropriate and trending hashtags.`;
    } else {
        prompt += ` Do not include any hashtags.`;
    }
    prompt += ` Ensure the post is concise, engaging, and suitable for a broad audience.`;

    try {
        // First, try flash model
        let generatedText;
        try {
            generatedText = await generateWithRetries(flashModel, prompt);
        } catch (flashError) {
            console.warn("Flash model failed, trying Pro model...");
            generatedText = await generateWithRetries(proModel, prompt);
        }

        res.json({ post: generatedText });

    } catch (error) {
        console.error('Error calling Gemini API:', error);
        let errorMessage = 'Failed to generate post from AI. Please try again later.';
        if (error.response && error.response.statusText) {
            errorMessage += ` Status: ${error.response.statusText}`;
        } else if (error.message) {
            errorMessage += ` Detail: ${error.message}`;
        }
        res.status(500).json({ error: errorMessage });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
