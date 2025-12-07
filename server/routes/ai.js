
const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Summary = require('../models/Summary');

// Initialize Gemini
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

router.post('/summary', async (req, res) => {
    const { url, title, description, content } = req.body;

    if (!url) {
        return res.status(400).json({ msg: 'URL is required' });
    }

    try {
        // 1. Check Cache
        let cachedSummary = await Summary.findOne({ url });
        if (cachedSummary) {
            console.log('Serving summary from cache');
            return res.json(cachedSummary.content);
        }

        // 2. Prepare Prompt
        const prompt = `
        You are a concise news editor. 
        Analyze the following news context and generate exactly 3 short, simple bullet points summarizing the key event, context, and implication.

    CRITICAL: Output MUST be a valid JSON array of strings.
        Example: ["Point 1", "Point 2", "Point 3"]
        Do NOT use Markdown formatting(like \`\`\`json). Just the raw array.
        
        Title: ${title}
        Description: ${description || 'No description available'}
        Content Snippet: ${content || ''}
        `;

        if (!apiKey) {
            return res.status(500).json({ msg: "Server missing GEMINI_API_KEY" });
        }

        // 3. Call Gemini
        // Using 'gemini-flash-latest' as specific 1.5 versions were not listed for this key
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // 4. Clean and Parse Result
        // Remove markdown code blocks if present
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        let points;
        try {
            points = JSON.parse(text);
        } catch (e) {
            console.error("Failed to parse AI response as JSON:", text);
            // Fallback: split by newlines if JSON parse fails
            points = text.split('\n')
                .map(line => line.replace(/^[\\d\\-\\*\\•\\.]+\\s*/, '').trim())
                .filter(line => line.length > 0)
                .slice(0, 3);
        }

        // Ensure it's an array
        if (!Array.isArray(points)) {
            points = [text];
        }

        // Fallback if parsing fails or returns empty
        if (points.length === 0) {
            points.push("Could not generate summary.");
        }

        // 5. Save to Cache
        const newSummary = new Summary({
            url,
            content: points
        });
        await newSummary.save();

        res.json(points);

    } catch (error) {
        console.error("AI Summary Error Full Details:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
        if (error.response) {
            console.error("Gemini API Response Error:", error.response);
        }
        res.status(500).json({ msg: "Failed to generate summary", error: error.message });
    }
});

module.exports = router;
