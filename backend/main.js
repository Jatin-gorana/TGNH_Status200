const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
const upload = multer({ dest: "uploads/" });

const genAI = new GoogleGenerativeAI("AIzaSyAF7Hu-wUVF-NPNZV2jNPysCCbAi3qv6mk");

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

    const prompt = "Artifact Recognition: identify its name, origin, cultural context, Analyze the artifact for localized cultural information based on its specific region of origin, Estimate the artifact's age and provide a probability of its authenticity, including verification for any potential counterfeit indicators";

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

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});













// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const fs = require("fs");

// const genAI = new GoogleGenerativeAI("AIzaSyAF7Hu-wUVF-NPNZV2jNPysCCbAi3qv6mk");

// const funcal = async () => {
//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//   const prompt = "Artifact Recognition: identify its name, origin, cultural context, Analyze the artifact for localized cultural information based on its specific region of origin, Estimate the artifact's age and provide a probability of its authenticity, including verification for any potential counterfeit indicators"
//   const image = {
//     inlineData: {
//       data: Buffer.from(fs.readFileSync("ar2.jpg")).toString("base64"),
//       mimeType: "image/jpeg",
//     },
//   };

//   try {
//     // Add the text parameter along with the image data
//     const result = await model.generateContent([
//       { text: prompt },
//       image,
//     ]);
//     console.log(result.response.text());
//   } catch (error) {
//     console.error("Error generating content:", error);
//   }
// };

// funcal();
