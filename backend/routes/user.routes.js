import express from "express";
import protect from "../middleware/auth.middleware.js";
import Link from "../models/link.js";

console.log("LINK ROUTES LOADED");
const router = express.Router();

router.post("/", protect, async (req, res) => {
    try {
        const { title, platform, url, link } = req.body;
        const finalTitle = title || platform;
        const finalUrl = url || link;

        if (!finalUrl) {
            return res.status(400).json({ message: "Link URL is required." });
        }

        const userId = req.user.id || req.user._id;

        const newLink = await Link.create({
            title: finalTitle || "Unknown Platform",
            url: finalUrl,
            user: userId,
        });

        res.status(201).json(newLink);
    } catch (error) {
        console.error("error on POST /api/links:", error.message);
        res.status(500).json({ message: error.message });
    }
});

router.get("/", protect, async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const links = await Link.find({ user: userId });
        res.json(links);
    } catch (error) {
        console.error(" შეცდომა GET /api/links-ზე:", error.message);
        res.status(500).json({ message: error.message });
    }
});

router.delete("/:id", protect, async (req, res) => {
    try {
       
        if (!req.params.id || req.params.id === "undefined") {
            return res.status(400).json({ message: "Invalid or missing Link ID" });
        }

        const userId = req.user.id || req.user._id;

        const link = await Link.findOneAndDelete({
            _id: req.params.id,
            user: userId,
        });

        if (!link) {
            return res.status(404).json({ message: "Link not found or you do not have permission" });
        }

        res.json({ message: "link deleted successfully" });
    } catch (error) {
        console.error(" error on DELETE /api/links/:id:", error.message);
        res.status(500).json({ message: error.message });
    }
});

export default router;