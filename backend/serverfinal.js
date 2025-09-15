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
const backendUrl = process.env.BACKEND_URL;

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const STABILITY_API_KEY = process.env.STABILITY_API_KEY;
const STABILITY_API_ENDPOINT =
  "https://api.stability.ai/v2beta/3d/stable-fast-3d";

// Google Generative AI Initialization
const genAI = new GoogleGenerativeAI(GOOGLE_GEN_AI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generationConfig = {
  temperature: 0.7,
  maxOutputTokens: 800,
};

const unlinkAsync = promisify(fs.unlink);

async function convertWithStabilityAPI(imagePath) {
  try {
    if (!STABILITY_API_KEY) {
      throw new Error("Stability API key is not configured");
    }

    if (!imagePath || !fs.existsSync(imagePath)) {
      throw new Error("Invalid image path provided");
    }

    console.log(
      "Using Stability API Key:",
      STABILITY_API_KEY.substring(0, 10) + "..."
    );

    const outputDir = path.join(__dirname, "outputs");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    const outputPath = path.join(outputDir, `stable_${Date.now()}.glb`);

    const formData = new FormData();
    formData.append("image", fs.createReadStream(imagePath));
    formData.append("texture_resolution", "2048");
    formData.append("foreground_ratio", "0.85");
    formData.append("remesh", "quad");

    const response = await axios.post(STABILITY_API_ENDPOINT, formData, {
      validateStatus: undefined,
      responseType: "arraybuffer",
      headers: {
        Authorization: `Bearer ${STABILITY_API_KEY}`,
        ...formData.getHeaders(),
        "stability-client-id": "cultural-web-app",
      },
    });

    if (response.status === 200) {
      fs.writeFileSync(outputPath, Buffer.from(response.data));
      return {
        success: true,
        glb_url: `/outputs/${path.basename(outputPath)}`,
        message: "3D model generated successfully using Stability AI",
      };
    } else {
      const errorMessage = Buffer.from(response.data).toString();
      throw new Error(`API Error ${response.status}: ${errorMessage}`);
    }
  } catch (error) {
    console.error("Stability API conversion error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
        ? Buffer.from(error.response.data).toString()
        : null,
    });
    return {
      success: false,
      error: error.message || "Failed to process the conversion request",
    };
  }
}

// Route: Artifact Analysis
app.post(`${backendUrl}/analyze`, upload.single("image"), async (req, res) => {
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
app.post(`${backendUrl}/convert2dto3d`, upload.single("image"), async (req, res) => {
  try {
    const result = await convertWithStabilityAPI(req.file.path);
    res.json(result);
  } catch (error) {
    console.error("Error in Stability 3D conversion:", error);
    res.status(500).json({ error: "Failed to convert to 3D model" });
  } finally {
    if (req.file?.path) {
      try {
        await unlinkAsync(req.file.path);
      } catch (err) {
        console.error("Error cleaning up uploaded file:", err);
      }
    }
  }
});

// Route: Image Reconstruction
app.post(`${backendUrl}/reconstruct`, upload.single("image"), async (req, res) => {
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
app.post(`${backendUrl}/climate-impact`, async (req, res) => {
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


// Create outputs directory if it doesn't exist
const outputDir = path.join(__dirname, "outputs");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
