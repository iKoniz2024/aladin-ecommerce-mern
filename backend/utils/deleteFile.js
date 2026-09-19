const fs = require("fs");
const path = require("path");

/**
 * Removes a file from backend/uploads directory if it exists.
 * @param {string} fileUrlOrPath - URL or relative path (e.g., "/uploads/filename.jpg" or full URL)
 */
const deleteFile = async (fileUrlOrPath) => {
    if (!fileUrlOrPath || typeof fileUrlOrPath !== "string") return;

    try {
        // Extract filename from URL or path
        const filename = fileUrlOrPath.split("/uploads/").pop();

        // Prevent path traversal or empty filename
        if (!filename || filename.includes("..")) return;

        const filePath = path.join(__dirname, "..", "uploads", filename);

        if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
            console.log(`Deleted old image: ${filename}`);
        }
    } catch (error) {
        console.error("Error deleting file:", error.message);
    }
};

module.exports = { deleteFile };
