const express = require("express");
const multer = require("multer");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());
const upload = multer({ dest: "uploads/" });

// Environment Variables (replace with your actual API keys)
const API_KEY = "msy_hwm3ipATvteMfgdCKpBHUpSG9tOE0tkVmTwD"; // Meshy API Key
const MESHY_API_ENDPOINT = "https://api.meshy.ai/openapi/v1/image-to-3d";
const GOOGLE_GEN_AI_KEY = "AIzaSyAF7Hu-wUVF-NPNZV2jNPysCCbAi3qv6mk"; // Google Generative AI Key

// Google Generative AI Initialization
const genAI = new GoogleGenerativeAI(GOOGLE_GEN_AI_KEY);

// Route for Artifact Analysis
app.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const imagePath = path.join(__dirname, req.file.path);
    const image = {
      inlineData: {
        data: Buffer.from(fs.readFileSync(imagePath)).toString("base64"),
        mimeType: "image/jpeg",
      },
    };

    const prompt = `Artifact Recognition: 
    1. Identify its name, origin, and cultural context.
    2. Analyze the artifact for localized cultural information based on its specific region of origin.
    3. Estimate the artifact's age and provide a probability of its authenticity, including verification for any potential counterfeit indicators.`;

    const result = await model.generateContent([
      { text: prompt },
      image,
    ]);

    res.json({ result: result.response.text() });
  } catch (error) {
    console.error("Error analyzing image:", error);
    res.status(500).json({ error: "Error analyzing the image" });
  }
});

// Route to Upload Image and Initiate 3D Conversion
app.post("/api/convert", async (req, res) => {
  const { image_url } = req.body;

  if (!image_url) {
    return res.status(400).json({ error: "Image URL is required" });
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
    console.error("Error initiating conversion:", error.message);
    res.status(500).json({ error: "Failed to initiate 3D model conversion" });
  }
});

// Route to Fetch the 3D Model Result
app.get("/api/result/:taskId", async (req, res) => {
  const { taskId } = req.params;

  const headers = { Authorization: `Bearer ${API_KEY}` };
  try {
    const response = await axios.get(`${MESHY_API_ENDPOINT}/${taskId}`, { headers });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching result:", error.message);
    res.status(500).json({ error: "Failed to fetch 3D model result" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});












// perfectly running


// const express = require('express');
// const axios = require('axios');
// const cors = require('cors');

// const app = express();
// const PORT = 5000;

// // Middleware
// app.use(express.json());
// app.use(cors());

// // Environment Variables (replace with your values)
// const API_KEY = 'msy_hwm3ipATvteMfgdCKpBHUpSG9tOE0tkVmTwD';
// const MESHY_API_ENDPOINT = 'https://api.meshy.ai/openapi/v1/image-to-3d';

// // Route to upload an image and initiate the 3D conversion
// app.post('/api/convert', async (req, res) => {
//   const { image_url } = req.body;

//   if (!image_url) {
//     return res.status(400).json({ error: 'Image URL is required' });
//   }

//   const headers = { Authorization: `Bearer ${API_KEY}` };
//   const payload = {
//     image_url,
//     enable_pbr: true,
//     should_remesh: true,
//     should_texture: true,
//   };

//   try {
//     const response = await axios.post(MESHY_API_ENDPOINT, payload, { headers });
//     res.json({ taskId: response.data.result });
//   } catch (error) {
//     console.error('Error initiating conversion:', error.message);
//     res.status(500).json({ error: 'Failed to initiate 3D model conversion' });
//   }
// });

// // Route to fetch the 3D model result
// app.get('/api/result/:taskId', async (req, res) => {
//   const { taskId } = req.params;

//   const headers = { Authorization: `Bearer ${API_KEY}` };
//   try {
//     const response = await axios.get(`${MESHY_API_ENDPOINT}/${taskId}`, { headers });
//     res.json(response.data);
//   } catch (error) {
//     console.error('Error fetching result:', error.message);
//     res.status(500).json({ error: 'Failed to fetch 3D model result' });
//   }
// });

// // Start Server
// app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
