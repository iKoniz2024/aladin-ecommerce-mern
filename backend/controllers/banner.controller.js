const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");
const { withCache, clearCache } = require("../utils/cache");
const { buildIdQuery } = require("../utils/buildIdQuery");
const { deleteFile } = require("../utils/deleteFile");

const createBanner = async (req, res) => {
    try {
        const db = getDB();
        const bannersCollection = db.collection("banners");

        const { title, image, link, isActive } = req.body;

        const newBanner = {
            title,
            image,
            link,
            isActive,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await bannersCollection.insertOne(newBanner);

        clearCache();

        res.status(201).send({
            message: "Banner created successfully",
            insertedId: result.insertedId
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

const getAllBanners = async (req, res) => {
    try {
        const banners = await withCache("banners", 120, async () => {
            const db = getDB();
            const bannersCollection = db.collection("banners");
            return await bannersCollection.find({ isActive: { $ne: false } }).sort({ createdAt: -1 }).toArray();
        });
        res.send(banners);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

const getSingleBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const db = getDB();
        const bannersCollection = db.collection("banners");
        const banner = await bannersCollection.findOne(buildIdQuery(id));
        if (!banner) {
            return res.status(404).send({ message: "Banner not found" });
        }
        res.send(banner);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

const updateBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const db = getDB();
        const bannersCollection = db.collection("banners");

        const existingBanner = await bannersCollection.findOne(buildIdQuery(id));
        if (!existingBanner) {
            return res.status(404).send({ message: "Banner not found" });
        }

        // Delete old image if a new image URL is being updated
        if (req.body.image && existingBanner.image && req.body.image !== existingBanner.image) {
            await deleteFile(existingBanner.image);
        }

        const result = await bannersCollection.updateOne(
            buildIdQuery(id),
            { $set: { ...req.body, updatedAt: new Date() } }
        );

        clearCache();
        res.send({ message: "Banner updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

const deleteBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const db = getDB();
        const bannersCollection = db.collection("banners");

        const existingBanner = await bannersCollection.findOne(buildIdQuery(id));
        if (!existingBanner) {
            return res.status(404).send({ message: "Banner not found" });
        }

        if (existingBanner.image) {
            await deleteFile(existingBanner.image);
        }

        await bannersCollection.deleteOne(buildIdQuery(id));
        clearCache();
        res.send({ message: "Banner deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

module.exports = {
    createBanner, getAllBanners, getSingleBanner, updateBanner, deleteBanner
};
