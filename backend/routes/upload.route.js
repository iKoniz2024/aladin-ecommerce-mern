const express = require("express");
const multer = require("multer");
const upload = require("../middleware/upload");

const router = express.Router();

// Single file upload endpoint
router.post("/single", (req, res) => {
    upload.single("image")(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(400).json({ message: "File size exceeds limit. Maximum allowed size is 5MB." });
            }
            return res.status(400).json({ message: err.message });
        } else if (err) {
            return res.status(400).json({ message: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No image file uploaded." });
        }

        const relativeUrl = `/uploads/${req.file.filename}`;
        res.status(200).json({
            message: "File uploaded successfully",
            url: relativeUrl
        });
    });
});

// Multiple files upload endpoint
router.post("/multiple", (req, res) => {
    upload.array("images", 10)(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(400).json({ message: "One or more files exceed the 5MB size limit." });
            }
            return res.status(400).json({ message: err.message });
        } else if (err) {
            return res.status(400).json({ message: err.message });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No image files uploaded." });
        }

        const urls = req.files.map((file) => `/uploads/${file.filename}`);
        res.status(200).json({
            message: "Files uploaded successfully",
            urls
        });
    });
});

module.exports = router;
