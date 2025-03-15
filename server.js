const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Serve static files (like HTML or JS) if needed
app.use(express.static('public'));

// Web Proxy route
app.get('/proxy', async (req, res) => {
  const url = req.query.url;
  
  if (!url) {
    return res.status(400).send('Please provide a URL using ?url=parameter');
  }

  try {
    const response = await axios.get(url);
    res.send(response.data);  // Send the fetched HTML content to the client
  } catch (error) {
    res.status(500).send('Error fetching the URL');
  }
});

app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});
