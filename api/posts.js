const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DATABASE || "portfolio";
const collectionName = process.env.MONGODB_COLLECTION || "blogPosts";

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
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
    const client = await connectToDatabase();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const posts = await collection.find({}).sort({ date: -1 }).toArray();

    // Transform _id to string
    const transformedPosts = posts.map((post) => ({
      ...post,
      _id: post._id.toString(),
    }));

    return res.status(200).json({ posts: transformedPosts });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Failed to fetch posts", details: error.message });
  }
};
