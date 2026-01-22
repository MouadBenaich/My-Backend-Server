const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/clarifai", async (req, res) => {
  const { imageUrl } = req.body;

  const raw = JSON.stringify({
    user_app_id: { user_id: "clarifai", app_id: "main" },
    inputs: [{ data: { image: { url: imageUrl } } }]
  });

  try {
    const response = await fetch(
        "https://api.clarifai.com/v2/models/face-detection/versions/45fb9a671625463fa646c3523a3087d5/outputs",
        {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Key " + process.env.CLARIFAI_KEY
            },
            body: raw
        }
    );
    const data = await response.json();
    console.log("Clarifai API raw response:", JSON.stringify(data, null, 2));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
