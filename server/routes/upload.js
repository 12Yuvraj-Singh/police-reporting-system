import express from "express";
import ImageKit from "imagekit";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// FRONTEND uses this to get signature + token
router.get("/auth", (req, res) => {
  try {
    const result = imagekit.getAuthenticationParameters();
    res.json({
      signature: result.signature,
      token: result.token,
      expire: result.expire,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to get ImageKit auth" });
  }
});

export default router;
