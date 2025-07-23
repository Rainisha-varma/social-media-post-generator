require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const path = require('path');

// Import the GoogleGenerativeAI class directly
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3000;

// Initialize Gemini client
// Access your API key as an environment variable (recommended)
if (!process.env.GEMINI_API_KEY) {
    console.error("Error: GEMINI_API_KEY environment variable is not set.");
    process.exit(1); // Exit the process if API key is missing
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Choose a model. "gemini-pro" is good for text-only, "gemini-1.5-flash" for speed.
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 

// Middleware to serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON request bodies
app.use(express.json());

// API endpoint for generating social media posts
app.post('/generate-post', async (req, res) => {
    const { topic, tone, platform, addHashtags, addEmojis } = req.body;

    if (!topic) {
        return res.status(400).json({ error: 'Topic is required.' });
    }

    // Start with a clear and concise base prompt
    let prompt = `Generate a compelling social media post.`;

    // Add the core topic
    prompt += ` The main subject is "${topic}".`;

    // Conditionally add tone
    if (tone && tone !== 'Any') { // Check for 'Any' option as well
        prompt += ` The tone should be ${tone}.`;
    }

    // Conditionally add platform specificity
    if (platform && platform !== 'Any') { // Check for 'Any' option as well
        prompt += ` It's specifically tailored for ${platform}.`;
    }

    // Conditionally add requests for emojis and hashtags based on toggle switches
    if (addEmojis) {
        prompt += ` Please include relevant and engaging emojis.`;
    }
    if (addHashtags) {
        prompt += ` Also, add appropriate and trending hashtags.`;
    }

    // Add a concluding instruction for quality
    prompt += ` Ensure the post is concise, engaging, and suitable for a broad audience.`;

    try {
        // Call the Gemini API
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const generatedText = response.text(); // Get the generated text

        res.json({ post: generatedText });

    } catch (error) {
        console.error('Error calling Gemini API:', error);
        // Provide more specific error messages if possible based on error.response or error.message
        let errorMessage = 'Failed to generate post from AI. Please check your API key, model access, and try again.';
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