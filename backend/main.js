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
   


    const response = await model.generateContent([
              { text: prompt },
            ]);

    res.json({ analysis: response.response.text() });
  } catch (error) {
    console.error("Error in /climate-impact endpoint:", error.message);
    res.status(500).json({ error: "Failed to fetch climate impact analysis." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

