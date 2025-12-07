const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
    const { category, q } = req.query;

    try {
        let endpoint = 'https://newsapi.org/v2/top-headlines';
        const params = {
            apiKey: process.env.NEWS_API_KEY,
            language: 'en',
        };

        if (q) {
            endpoint = 'https://newsapi.org/v2/everything';
            params.q = q;
            params.sortBy = 'publishedAt';
        } else if (category) {
            switch (category.toLowerCase()) {
                case 'india':
                    // Top headlines for India often returns 0/limited on free tier sometimes, using everything for guaranteed content
                    endpoint = 'https://newsapi.org/v2/everything';
                    params.q = 'India';
                    params.sortBy = 'publishedAt';
                    break;
                case 'global':
                    // Top headlines US/General
                    params.country = 'us';
                    break;
                case 'tech':
                    endpoint = 'https://newsapi.org/v2/everything';
                    params.q = 'technology';
                    break;
                case 'sports':
                    params.category = 'sports';
                    params.country = 'in'; // Try India sports, fallback?
                    break;
                case 'finance':
                    params.category = 'business';
                    break;
                case 'political':
                    endpoint = 'https://newsapi.org/v2/everything';
                    params.q = 'politics';
                    break;
                default:
                    // General/Home: Use US top headlines as 'General' or just fallback to 'general' category
                    params.category = 'general';
                    // params.country = 'in'; // If this breaks, remove it.
                    // Making default "Global" (US) to ensure content
                    params.country = 'us';
                    break;
            }
        } else {
            // Default load (Home)
            params.category = 'general';
            params.country = 'us'; // Default to US to ensure we get *something*
        }

        const response = await axios.get(endpoint, { params });
        res.json(response.data);
    } catch (error) {
        console.error('[NewsRoute] Error:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
