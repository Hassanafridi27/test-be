const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(express.json());

// Update the CORS configuration to allow the 'api-key' header
app.use(cors({
  allowedHeaders: ['Content-Type', 'api-key'], // Add 'api-key' to the list of allowed headers
  origin: 'http://localhost:3002', // Replace with the actual origin of your frontend
}));

// Define a route to fetch data from the New York Times API with a dynamic section
app.get('/api/stories/:section', async (req, res) => {
  const { section } = req.params;
  const apiKey = req.get('api-key');

  // Validate the API key
  if (apiKey !== 'hAPxYFiWeIOMQQHXgDGbDubjwQn8lzMv') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const response = await axios.get(`https://api.nytimes.com/svc/topstories/v2/${section}.json`, {
      params: {
        apikey: apiKey,
      },
    });

    const storiesData = response.data.results;

    res.json(storiesData);
  } catch (error) {
    console.error('Error fetching stories', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Express app is running on port ${port}`);
});
