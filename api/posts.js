const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DATABASE || "portfolio";
const collectionName = process.env.MONGODB_COLLECTION || "blogPosts";

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not set");
  }

  const client = new MongoClient(uri, {
    maxPoolSize: 10,
  });

  await client.connect();
  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection(collectionName);

    const posts = await collection.find({}).sort({ date: -1 }).toArray();

    const transformedPosts = posts.map((post) => ({
      ...post,
      _id: post._id.toString(),
    }));

    return res.status(200).json({ posts: transformedPosts });
  } catch (error) {
    console.error("Database error:", error.message);
    return res.status(500).json({ 
      error: "Failed to fetch posts", 
      message: error.message 
    });
  }
};
