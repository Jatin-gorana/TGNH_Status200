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




