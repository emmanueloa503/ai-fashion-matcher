const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 5000;

const CLARIFAI_API_KEY = 'YOUR_CLARIFAI_PAT'; // replace with your actual PAT
const CLARIFAI_USER_ID = 'eo2361'; // your user ID
const CLARIFAI_APP_ID = 'niavelle'; // your app ID
const WORKFLOW_ID = 'fashion-matcher';

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.post('/analyze', async (req, res) => {
    const { image } = req.body;

    if (!image) {
        return res.status(400).json({ error: 'Image is required' });
    }

    try {
        const response = await fetch(`https://api.clarifai.com/v2/users/${CLARIFAI_USER_ID}/apps/${CLARIFAI_APP_ID}/workflows/${WORKFLOW_ID}/results`, {
            method: 'POST',
            headers: {
                'Authorization': `Key ${CLARIFAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "inputs": [
                    {
                        "data": {
                            "image": {
                                "base64": image.replace(/^data:image\/\w+;base64,/, '')
                            }
                        }
                    }
                ]
            })
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Image analysis failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
