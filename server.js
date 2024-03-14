const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001; // Use the provided port or default to 3000

// Define API user key
const rapidAPIKey = '126e2cd957mshbd5ead3a2e18a5ap10fe39jsn8e82fd0268a2';

// Cache data to reduce fetch time
let cachedData;

// Fetch organization data
const fetchOrganizationData = async () => {
    try {
        const options = {
            method: 'POST',
            url: 'https://crunchbase-crunchbase-v1.p.rapidapi.com/searches/organizations',
            headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Key': rapidAPIKey,
                'X-RapidAPI-Host': 'crunchbase-crunchbase-v1.p.rapidapi.com'
            },
            data: {
                field_ids: [
                    'identifier',
                    'location_identifiers',
                    'short_description',
                    'rank_org',
                    'image_url'
                ],
                limit: 50,
                order: [
                    {
                        field_id: 'rank_org',
                        sort: 'asc'
                    }
                ],
                query: [
                    {
                        field_id: 'location_identifiers',
                        operator_id: 'includes',
                        type: 'predicate',
                        values: [
                            '6106f5dc-823e-5da8-40d7-51612c0b2c4e'
                        ]
                    },
                    {
                        field_id: 'facet_ids',
                        operator_id: 'includes',
                        type: 'predicate',
                        values: ['company']
                    }
                ]
            }
        };

        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error('Error fetching organization data:', error.message);
        throw error;
    }
};

// Cache organization data
const cacheOrganizationData = async () => {
    try {
        cachedData = await fetchOrganizationData();
        console.log('Organization data cached successfully.');
    } catch (error) {
        console.error('Error caching organization data:', error.message);
    }
};

// Endpoint to retrieve organization data
app.get('/api/organizations', async (req, res) => {
    try {
        // Check if data is already cached
        if (!cachedData) {
            // If not cached, fetch and cache data
            await cacheOrganizationData();
        }
        // Return cached data
        res.status(200).json(cachedData);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
