const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bcrypt = require("bcrypt");
const knex = require("knex");

// ✅ Connect to PostgreSQL (Render Internal/External URL via env var)
const db = knex({
  client: "pg",
  connection: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.json());

/* ---------------- REGISTER ROUTE ---------------- */
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json("Incorrect form submission");
  }

  try {
    const hash = await bcrypt.hash(password, 10);

    const newUser = await db("users")
      .returning("*")
      .insert({
        name,
        email,
        hash,
        level: "Beginner", // default level
        joined: new Date()
      });

    res.json(newUser[0]);
  } catch (err) {
    console.error(err);
    res.status(400).json("Unable to register");
  }
});

/* ---------------- SIGNIN ROUTE ---------------- */
app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json("Incorrect form submission");
  }

  try {
    const user = await db("users").where({ email }).first();
    if (!user) {
      return res.status(400).json("User not found");
    }

    const valid = await bcrypt.compare(password, user.hash);
    if (valid) {
      res.json(user);
    } else {
      res.status(400).json("Wrong credentials");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Error signing in");
  }
});

/* ---------------- FACE++ API ROUTE ---------------- */
app.post("/facepp", async (req, res) => {
  const { imageUrl, userId } = req.body;

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

    if (data.faces && data.faces.length > 0) {
      // ✅ Face detected → upgrade user level
      const user = await db("users").where({ id: userId }).first();

      if (user) {
        let newLevel;
        switch (user.level) {
          case "Beginner": newLevel = "Intermediate"; break;
          case "Intermediate": newLevel = "Advanced"; break;
          case "Advanced": newLevel = "Expert"; break;
          default: newLevel = "Master";
        }

        const updatedUser = await db("users")
          .where({ id: userId })
          .update({ level: newLevel })
          .returning("*");

        res.json({ faces: data.faces, user: updatedUser[0] });
      } else {
        res.json({ faces: data.faces });
      }
    } else {
      res.json({ faces: [] });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- SERVER LISTEN ---------------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
