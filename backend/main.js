const express = require("express");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");
const cloudinary = require("cloudinary").v2;
const app = express();
const PORT = 5001;

cloudinary.config({
  cloud_name: 'dejmb5qcq', 
  api_key: '216875435642652', 
  api_secret: 'bTfRpMEb3Pjg6iEi4ApR1IZUYCk'
});

app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

const PHOTAI_API_URL = "https://prodapi.phot.ai/external/api/v3/user_activity/old-photos-restore-2k";
const PHOTAI_API_KEY = "6791e1061f797f5170b9c2e8_0b7f38af316059a31b98_apyhitools";

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

app.listen(PORT, () => {
  console.log(`Backend is running on http://localhost:${PORT}`);
});






// img nhi aya par fiile upload succesfull

// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const cors = require('cors');

// const app = express();
// const port = 5001;
// app.use(cors());

// // Set up multer storage configuration
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // Ensure the 'uploads' folder exists
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     // Use the original file name with a timestamp to avoid conflicts
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });

// // Initialize multer with storage configuration
// const upload = multer({ storage: storage });

// // Middleware to check if the request contains a file
// app.post('/api/upload', upload.single('image'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).send('No file uploaded');
//   }

//   // If file uploaded successfully, access its path
//   console.log('File uploaded:', req.file.path);

//   // Respond with the file path or a success message
//   res.send({
//     message: 'File uploaded successfully',
//     filePath: req.file.path
//   });
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Backend running on http://localhost:${port}`);
// });











// const express = require("express");
// const multer = require("multer");
// const cors = require("cors");
// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const fs = require("fs");
// const path = require("path");

// const app = express();
// app.use(cors());
// const upload = multer({ dest: "uploads/" });

// const genAI = new GoogleGenerativeAI("AIzaSyAF7Hu-wUVF-NPNZV2jNPysCCbAi3qv6mk");

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

//     const prompt = "Artifact Recognition: identify its name, origin, cultural context, Analyze the artifact for localized cultural information based on its specific region of origin, Estimate the artifact's age and provide a probability of its authenticity, including verification for any potential counterfeit indicators";

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

// const PORT = 5001;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });















// // const { GoogleGenerativeAI } = require("@google/generative-ai");
// // const fs = require("fs");

// // const genAI = new GoogleGenerativeAI("AIzaSyAF7Hu-wUVF-NPNZV2jNPysCCbAi3qv6mk");

// // const funcal = async () => {
// //   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// //   const prompt = "Artifact Recognition: identify its name, origin, cultural context, Analyze the artifact for localized cultural information based on its specific region of origin, Estimate the artifact's age and provide a probability of its authenticity, including verification for any potential counterfeit indicators"
// //   const image = {
// //     inlineData: {
// //       data: Buffer.from(fs.readFileSync("ar2.jpg")).toString("base64"),
// //       mimeType: "image/jpeg",
// //     },
// //   };

// //   try {
// //     // Add the text parameter along with the image data
// //     const result = await model.generateContent([
// //       { text: prompt },
// //       image,
// //     ]);
// //     console.log(result.response.text());
// //   } catch (error) {
// //     console.error("Error generating content:", error);
// //   }
// // };

// // funcal();
