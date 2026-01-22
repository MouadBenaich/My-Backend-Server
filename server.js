const express = require("express");
const cors = require("cors");
require("dotenv").config();

const fetch = (...args) => import("node-fetch").then(({default: fetch}) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.json());

app.post("/facepp", async (req, res) => {
  const { imageUrl } = req.body;

  try {
    const response = await fetch("https://api-us.faceplusplus.com/facepp/v3/detect", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        api_key: process.env.FACEPP_KEY,
        api_secret: process.env.FACEPP_SECRET,
        image_url: imageUrl,
        return_landmark: 0,
        return_attributes: "none"
      })
    });

    const data = await response.json();
    console.log("Face++ API raw response:", JSON.stringify(data, null, 2));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
