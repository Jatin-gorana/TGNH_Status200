// Required Modules
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());
const upload = multer({ dest: "uploads/" });

// Environment Variables (from .env)
const MESHY_API_KEY = process.env.MESHY_API_KEY;
const MESHY_API_ENDPOINT = "https://api.meshy.ai/openapi/v1/image-to-3d";
const GOOGLE_GEN_AI_KEY = process.env.GOOGLE_GEN_AI_KEY;
const PHOTAI_API_KEY = process.env.PHOTAI_API_KEY;
const PHOTAI_API_URL = "https://prodapi.phot.ai/external/api/v3/user_activity/old-photos-restore-2k";

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Google Generative AI Initialization
const genAI = new GoogleGenerativeAI(GOOGLE_GEN_AI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generationConfig = {
  temperature: 0.7,
  maxOutputTokens: 800,
};

// Route: Artifact Analysis
app.post("/analyze", upload.single("image"), async (req, res) => {
  try {
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
app.post("/api/convert", upload.single("image"), async (req, res) => {
  let imageUrl = req.body.image_url;
  let imageFile = req.file;

  if (!imageUrl && !imageFile) {
    return res.status(400).json({ error: "Image URL or image file is required" });
  }

  if (imageUrl) {
    imageUrl = imageUrl;
  } else if (imageFile) {
    try {
      const cloudinaryResponse = await cloudinary.uploader.upload(imageFile.path, {
        folder: "image-uploads",
      });
      imageUrl = cloudinaryResponse.secure_url;
    } catch (error) {
      console.error("Error uploading file:", error);
      return res.status(500).json({ error: "Failed to upload image file" });
    }
  }

  const headers = { Authorization: `Bearer ${MESHY_API_KEY}` };
  const payload = {
    image_url: imageUrl,
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

// Route: Climate Impact Analysis
app.post("/climate-impact", async (req, res) => {
  try {
    const { artifactName } = req.body;

    if (!artifactName) {
      return res.status(400).json({ error: "Artifact name is required" });
    }

    const prompt = `For ${artifactName}, fetch the climatic conditions of the artifact's location, including the following: temperature, humidity, UV exposure, and air quality. Perform a climate impact analysis based on these conditions, assess the risk to the artifact's preservation, and provide preventive care guidelines.`;

    const response = await model.generateContent([
      { text: prompt },
    ]);

    res.json({ analysis: response.response.text() });
  } catch (error) {
    console.error("Error in /climate-impact endpoint:", error.message);
    res.status(500).json({ error: "Failed to fetch climate impact analysis." });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
