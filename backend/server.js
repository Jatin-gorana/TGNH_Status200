const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Environment Variables (replace with your values)
const API_KEY = 'msy_hwm3ipATvteMfgdCKpBHUpSG9tOE0tkVmTwD';
const MESHY_API_ENDPOINT = 'https://api.meshy.ai/openapi/v1/image-to-3d';

// Route to upload an image and initiate the 3D conversion
app.post('/api/convert', async (req, res) => {
  const { image_url } = req.body;

  if (!image_url) {
    return res.status(400).json({ error: 'Image URL is required' });
  }

  const headers = { Authorization: `Bearer ${API_KEY}` };
  const payload = {
    image_url,
    enable_pbr: true,
    should_remesh: true,
    should_texture: true,
  };

  try {
    const response = await axios.post(MESHY_API_ENDPOINT, payload, { headers });
    res.json({ taskId: response.data.result });
  } catch (error) {
    console.error('Error initiating conversion:', error.message);
    res.status(500).json({ error: 'Failed to initiate 3D model conversion' });
  }
});

// Route to fetch the 3D model result
app.get('/api/result/:taskId', async (req, res) => {
  const { taskId } = req.params;

  const headers = { Authorization: `Bearer ${API_KEY}` };
  try {
    const response = await axios.get(`${MESHY_API_ENDPOINT}/${taskId}`, { headers });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching result:', error.message);
    res.status(500).json({ error: 'Failed to fetch 3D model result' });
  }
});

// Start Server
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
