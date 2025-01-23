const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

const apiKey = "AIzaSyAaUgKha2GsgfWpnbZiB42ycOZKYthfw98";

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 0.7,
  maxOutputTokens: 800,
};

// Endpoint to fetch climate impact analysis
app.post("/climate-impact", async (req, res) => {
  try {
    const { artifactName } = req.body;

    if (!artifactName) {
      return res.status(400).json({ error: "Artifact name is required" });
    }

    const prompt = `For ${artifactName}, fetch the climatic conditions of the artifact's location, including the following: temperature, humidity, UV exposure, and air quality. Perform a climate impact analysis based on these conditions, assess the risk to the artifact's preservation, and provide preventive care guidelines.`;

    const response = await model.generateText({
      prompt,
      generationConfig,
    });

    res.json({ analysis: response.text });
    console.log("Generated Analysis:", response.text);
  } catch (error) {
    console.error("Error in /climate-impact endpoint:", error.message);
    res.status(500).json({ error: "Failed to fetch climate impact analysis." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});










// const express = require("express");
// const cors = require("cors");
// const {
//   GoogleGenerativeAI,
// } = require("@google/generative-ai");

// const app = express();
// const PORT = 5001;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Google Generative AI setup
// const apiKey = "AIzaSyAaUgKha2GsgfWpnbZiB42ycOZKYthfw98"; // Ensure this is set in your environment variables
// const genAI = new GoogleGenerativeAI(apiKey);

// const model = genAI.getGenerativeModel({
//   model: "gemini-1.5-flash",
// });

// const generationConfig = {
//   temperature: 1,
//   topP: 0.95,
//   topK: 40,
//   maxOutputTokens: 8192,
//   responseMimeType: "text/plain",
// };

// // Endpoint to fetch climate impact analysis
// app.post("/climate-impact", async (req, res) => {
//   try {
//     const { artifactName } = req.body;

//     if (!artifactName) {
//       return res.status(400).json({ error: "Artifact name is required" });
//     }

//     const prompt = `For ${artifactName}, fetch the climatic conditions of the artifact's location, including the following: temperature, humidity, UV exposure, and air quality. Perform a climate impact analysis based on these conditions, assess the risk to the artifact's preservation, and provide preventive care guidelines. Ensure that the analysis is specific to the region's climate and tailored to the artifact's materials and age.`

    

//     const result = await model.generateContent([
//         { text: prompt },
//       ]);
  
//       res.json({ analysis: result.response.text() });

//       console.log(result.response.text());

//     // console.log(response.response.text);
//   } catch (error) {
//     console.error("Error generating response:", error.message);
//     res.status(500).json({ error: "Failed to fetch climate impact analysis" });
//   }
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });









// const express = require("express");
// const cors = require("cors");
// const multer = require("multer");
// const axios = require("axios");
// const cloudinary = require("cloudinary").v2;
// const app = express();
// const PORT = 5001;

// cloudinary.config({
//   cloud_name: 'dejmb5qcq', 
//   api_key: '216875435642652', 
//   api_secret: 'bTfRpMEb3Pjg6iEi4ApR1IZUYCk'
// });

// app.use(cors());
// app.use(express.json());

// const upload = multer({ dest: "uploads/" });

// const PHOTAI_API_URL = "https://prodapi.phot.ai/external/api/v3/user_activity/old-photos-restore-2k";
// const PHOTAI_API_KEY = "6791e1061f797f5170b9c2e8_0b7f38af316059a31b98_apyhitools";

// app.post("/reconstruct", upload.single("image"), async (req, res) => {
//   try {
//     const { color_flag } = req.body;

//     // Upload image to Cloudinary
//     const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
//       folder: "reconstructed_images",
//     });

//     const publicUrl = cloudinaryResponse.secure_url;

//     const data = {
//       source_url: publicUrl,
//       color_flag: color_flag === "true",
//     };

//     const headers = {
//       "x-api-key": PHOTAI_API_KEY,
//       "Content-Type": "application/json",
//     };

//     const response = await axios.post(PHOTAI_API_URL, data, { headers });
//     res.status(200).json(response.data);
//   } catch (error) {
//     console.error("Error reconstructing image:", error.response?.data || error.message);
//     res.status(500).json({ error: error.response?.data || "Failed to reconstruct the image" });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Backend is running on http://localhost:${PORT}`);
// });




