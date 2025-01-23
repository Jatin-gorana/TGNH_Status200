// Required Modules
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());
const upload = multer({ dest: "uploads/" });

// Environment Variables (replace with your actual API keys)
const MESHY_API_KEY = "msy_hwm3ipATvteMfgdCKpBHUpSG9tOE0tkVmTwD";
const MESHY_API_ENDPOINT = "https://api.meshy.ai/openapi/v1/image-to-3d";
const GOOGLE_GEN_AI_KEY = "AIzaSyAF7Hu-wUVF-NPNZV2jNPysCCbAi3qv6mk";
const PHOTAI_API_KEY = "6791e1061f797f5170b9c2e8_0b7f38af316059a31b98_apyhitools";
const PHOTAI_API_URL = "https://prodapi.phot.ai/external/api/v3/user_activity/old-photos-restore-2k";

// Cloudinary Configuration
cloudinary.config({
  cloud_name: "dejmb5qcq",
  api_key: "216875435642652",
  api_secret: "bTfRpMEb3Pjg6iEi4ApR1IZUYCk",
});

// Google Generative AI Initialization
const genAI = new GoogleGenerativeAI(GOOGLE_GEN_AI_KEY);

// Route: Artifact Analysis
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

    const prompt = `Artifact Recognition: \n
      1. Identify its name, origin, and cultural context.\n
      2. Analyze the artifact for localized cultural information based on its specific region of origin.\n
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

// Route: 3D Model Conversion
app.post("/api/convert", async (req, res) => {
  const { image_url } = req.body;

  if (!image_url) {
    return res.status(400).json({ error: "Image URL is required" });
  }

  const headers = { Authorization: `Bearer ${MESHY_API_KEY}` };
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

// Route: Fetch 3D Model Result
app.get("/api/result/:taskId", async (req, res) => {
  const { taskId } = req.params;

  const headers = { Authorization: `Bearer ${MESHY_API_KEY}` };
  try {
    const response = await axios.get(`${MESHY_API_ENDPOINT}/${taskId}`, { headers });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching result:", error.message);
    res.status(500).json({ error: "Failed to fetch 3D model result" });
  }
});

// Route: Image Reconstruction
app.post("/reconstruct", upload.single("image"), async (req, res) => {
  try {
    const { color_flag } = req.body;

    // Upload image to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
      folder: "reconstructed_images",
    });

    const publicUrl = cloudinaryResponse.secure_url;

    const data = {
      source_url: publicUrl,
      color_flag: color_flag === "true",
    };

    const headers = {
      "x-api-key": PHOTAI_API_KEY,
      "Content-Type": "application/json",
    };

    const response = await axios.post(PHOTAI_API_URL, data, { headers });
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error reconstructing image:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || "Failed to reconstruct the image" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});















// all good perfect

// const express = require("express");
// const multer = require("multer");
// const cors = require("cors");
// const axios = require("axios");
// const fs = require("fs");
// const path = require("path");
// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const app = express();
// const PORT = 5000;

// // Middleware
// app.use(express.json());
// app.use(cors());
// const upload = multer({ dest: "uploads/" });

// // Environment Variables (replace with your actual API keys)
// const API_KEY = "msy_hwm3ipATvteMfgdCKpBHUpSG9tOE0tkVmTwD"; // Meshy API Key
// const MESHY_API_ENDPOINT = "https://api.meshy.ai/openapi/v1/image-to-3d";
// const GOOGLE_GEN_AI_KEY = "AIzaSyAF7Hu-wUVF-NPNZV2jNPysCCbAi3qv6mk"; // Google Generative AI Key

// // Google Generative AI Initialization
// const genAI = new GoogleGenerativeAI(GOOGLE_GEN_AI_KEY);

// // Route for Artifact Analysis
// app.post("/analyze", upload.single("image"), async (req, res) => {
//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     const imagePath = path.join(__dirname, req.file.path);
//     const image = {
//       inlineData: {
//         data: Buffer.from(fs.readFileSync(imagePath)).toString("base64"),
//         mimeType: "image/jpeg",
//       },
//     };

//     const prompt = `Artifact Recognition: 
//     1. Identify its name, origin, and cultural context.
//     2. Analyze the artifact for localized cultural information based on its specific region of origin.
//     3. Estimate the artifact's age and provide a probability of its authenticity, including verification for any potential counterfeit indicators.`;

//     const result = await model.generateContent([
//       { text: prompt },
//       image,
//     ]);

//     res.json({ result: result.response.text() });
//   } catch (error) {
//     console.error("Error analyzing image:", error);
//     res.status(500).json({ error: "Error analyzing the image" });
//   }
// });

// // Route to Upload Image and Initiate 3D Conversion
// app.post("/api/convert", async (req, res) => {
//   const { image_url } = req.body;

//   if (!image_url) {
//     return res.status(400).json({ error: "Image URL is required" });
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
//     console.error("Error initiating conversion:", error.message);
//     res.status(500).json({ error: "Failed to initiate 3D model conversion" });
//   }
// });

// // Route to Fetch the 3D Model Result
// app.get("/api/result/:taskId", async (req, res) => {
//   const { taskId } = req.params;

//   const headers = { Authorization: `Bearer ${API_KEY}` };
//   try {
//     const response = await axios.get(`${MESHY_API_ENDPOINT}/${taskId}`, { headers });
//     res.json(response.data);
//   } catch (error) {
//     console.error("Error fetching result:", error.message);
//     res.status(500).json({ error: "Failed to fetch 3D model result" });
//   }
// });

// // Start Server
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });












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
