const { MongoClient, ServerApiVersion } = require("mongodb");
const dns = require('dns');
const { setupIndexes } = require("../utils/setupIndexes");
const { warmUpCache } = require("../utils/cache");

if (!process.env.VERCEL) {
    try {
        dns.setServers(["8.8.8.8", "1.1.1.1"]);
    } catch (e) {
        console.warn("DNS setServers skipped:", e.message);
    }
}

const dbUser = encodeURIComponent(process.env.DB_USER || "");
const dbPass = encodeURIComponent(process.env.DB_PASS || "");

// Connection URIs
const defaultUri = `mongodb+srv://${dbUser}:${dbPass}@cluster0.bb41v.mongodb.net/aladinShop?retryWrites=true&w=majority`;
const directUri = `mongodb://${dbUser}:${dbPass}@cluster0-shard-00-00.bb41v.mongodb.net:27017,cluster0-shard-00-01.bb41v.mongodb.net:27017,cluster0-shard-00-02.bb41v.mongodb.net:27017/?authSource=admin&replicaSet=atlas-imfz1t-shard-0&tls=true`;

const uri = process.env.MONGODB_URI || defaultUri;

const clientOptions = {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS: 30000,
    socketTimeoutMS: 60000,
    heartbeatFrequencyMS: 30000,
    maxPoolSize: 20,
    minPoolSize: 2,
    retryWrites: true,
    retryReads: true,
};

let client = new MongoClient(uri, clientOptions);
let db;

async function connectDB() {
    if (db) return db;
    try {
        await client.connect();
        db = client.db("aladinShop");
        console.log("MongoDB Connected (via SRV)");
    } catch (err) {
        if (err.code === 'ECONNREFUSED' || (err.message && err.message.includes('querySrv'))) {
            console.warn("SRV DNS lookup refused by ISP/local network. Falling back to direct connection...");
            client = new MongoClient(directUri, clientOptions);
            await client.connect();
            db = client.db("aladinShop");
            console.log("MongoDB Connected (via Direct Connection)");
        } else {
            throw err;
        }
    }

    // Setup Indexes
    await setupIndexes(db);

    // Warm up cache in background on startup
    warmUpCache(db).catch(err => console.error("Startup warmup failed:", err));

    return db;
}

function getDB() {
    return db;
}

module.exports = { connectDB, getDB };
