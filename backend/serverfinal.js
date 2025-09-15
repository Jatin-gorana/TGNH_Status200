// Required Modules
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { promisify } = require("util");
const FormData = require("form-data");
require("dotenv").config();

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use("/outputs", express.static(path.join(__dirname, "outputs")));
const upload = multer({ dest: "uploads/" });

// Environment Variables (from .env)
const GOOGLE_GEN_AI_KEY = process.env.GOOGLE_GEN_AI_KEY;
const PHOTAI_API_KEY = process.env.PHOTAI_API_KEY;
const PHOTAI_API_URL =
  "https://prodapi.phot.ai/external/api/v3/user_activity/old-photos-restore-2k";
const backendUrl = process.env.BACKEND_URL;

const STABILITY_API_KEY = process.env.STABILITY_API_KEY;
const STABILITY_API_ENDPOINT =
  "https://api.stability.ai/v2beta/3d/stable-fast-3d";

// Add Comet API constants
const COMET_API_KEY = process.env.COMET_API_KEY;
const COMET_API_ENDPOINT = 'https://api.cometapi.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent';


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

const unlinkAsync = promisify(fs.unlink);

// Stability API Function
async function convertWithStabilityAPI(imagePath) {
  try {
    if (!STABILITY_API_KEY) throw new Error("Stability API key is not configured");
    if (!imagePath || !fs.existsSync(imagePath)) throw new Error("Invalid image path provided");

    console.log("Using Stability API Key:", STABILITY_API_KEY.substring(0, 10) + "...");

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
        outputPath,
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
      data: error.response?.data ? Buffer.from(error.response.data).toString() : null,
    });
    return { success: false, error: error.message || "Failed to process the conversion request" };
  }
}

// --- Routes ---
// Artifact Analysis
app.post("/analyze", upload.single("image"), async (req, res) => {
  try {
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

    const result = await model.generateContent([{ text: prompt }, image]);
    res.json({ result: result.response.text() });
  } catch (error) {
    console.error("Error analyzing image:", error);
    res.status(500).json({ error: "Error analyzing the image" });
  }
});

// 3D Model Conversion (Stability)
app.post("/api/convert", upload.single("image"), async (req, res) => {
  try {
    const result = await convertWithStabilityAPI(req.file.path);
    res.json(result);
  } catch (error) {
    console.error("Error in 3D conversion:", error);
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

// Image Reconstruction - PhotAI
// app.post("/reconstruct", upload.single("image"), async (req, res) => {
//   try {
//     const { color_flag } = req.body;
//     const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
//       folder: "reconstructed_images",
//     });

//     const publicUrl = cloudinaryResponse.secure_url;
//     const data = { source_url: publicUrl, color_flag: color_flag === "true" };
//     const headers = { "x-api-key": PHOTAI_API_KEY, "Content-Type": "application/json" };

//     const response = await axios.post(PHOTAI_API_URL, data, { headers });
//     res.status(200).json(response.data);
//   } catch (error) {
//     console.error("Error reconstructing image:", error.response?.data || error.message);
//     res.status(500).json({ error: error.response?.data || "Failed to reconstruct the image" });
//   }
// });

// Comet API - Gemini 2.5 for Image Restoration
app.post("/reconstruct", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded" });
    }

    // Read and encode the image
    const imageData = fs.readFileSync(req.file.path);
    const base64Image = imageData.toString('base64');
    const mimeType = req.file.mimetype || 'image/jpeg';

    // Prepare the request body
    const requestBody = {
      contents: [{
        role: "user",
        parts: [
          {
            text: "Restore this historical artifact image. Remove all damage, deterioration, and aging effects while maintaining historical accuracy and authenticity. Enhance quality and preserve original details."
          },
          {
            inline_data: {
              mime_type: mimeType,
              data: base64Image
            }
          }
        ]
      }],
      generationConfig: {
        temperature: 0.4,
        topP: 0.8,
        responseModalities: ["TEXT", "IMAGE"]
      }
    };

    console.log('Sending request to Comet API...');
    
    // Make request to Comet API with proper Bearer token
    const response = await axios.post(COMET_API_ENDPOINT, requestBody, {
      headers: {
        'Authorization': `Bearer ${COMET_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'stability-client-id': 'cultural-web-restoration'
      }
    });

    // Log full response for debugging
    console.log('Comet API Response:', {
      status: response.status,
      headers: response.headers,
      data: response.data
    });

    if (response.status === 200 && response.data?.candidates?.[0]?.content?.parts) {
      const parts = response.data.candidates[0].content.parts;
      // Find the image part in the response
      const imagePart = parts.find(part => 
        part.inlineData?.mimeType?.startsWith('image/') ||
        part.inlineData?.mime_type?.startsWith('image/')
      );

      if (imagePart && (imagePart.inlineData?.data || imagePart.inline_data?.data)) {
        const imageBase64 = imagePart.inlineData?.data || imagePart.inline_data?.data;
        const outputPath = path.join(__dirname, 'outputs', `restored_${Date.now()}.jpg`);
        fs.writeFileSync(outputPath, Buffer.from(imageBase64, 'base64'));
        
        return res.json({
          success: true,
          restoredImageUrl: `/outputs/${path.basename(outputPath)}`,
          message: "Image restored successfully with Gemini"
        });
      } else {
        throw new Error("No image data found in response parts");
      }
    } else {
      throw new Error(`Invalid response format: ${JSON.stringify(response.data)}`);
    }

  } catch (error) {
    console.error("Restoration error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    res.status(500).json({ 
      success: false,
      error: error.message || "Failed to restore image",
      details: error.response?.data || error.stack
    });
  } finally {
    // Clean up uploaded file
    if (req.file?.path) {
      try {
        await unlinkAsync(req.file.path);
      } catch (err) {
        console.error("Error cleaning up uploaded file:", err);
      }
    }
  }
});

// Climate Impact Analysis
app.post("/climate-impact", async (req, res) => {
  try {
    const { artifactName } = req.body;
    if (!artifactName) return res.status(400).json({ error: "Artifact name is required" });

    const prompt = `For ${artifactName}, fetch the climatic conditions of the artifact's location, including temperature, humidity, UV exposure, and air quality. Perform a climate impact analysis, assess the risk to the artifact's preservation, and provide preventive care guidelines.`;

    const response = await model.generateContent([{ text: prompt }]);
    res.json({ analysis: response.response.text() });
  } catch (error) {
    console.error("Error in /climate-impact endpoint:", error.message);
    res.status(500).json({ error: "Failed to fetch climate impact analysis." });
  }
});

// Ensure outputs folder exists
const outputDir = path.join(__dirname, "outputs");
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
