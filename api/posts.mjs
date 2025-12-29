import { MongoClient } from "mongodb";

export default async function handler(req, res) {
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

  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DATABASE || "portfolio";
  const collectionName = process.env.MONGODB_COLLECTION || "blogPosts";

  if (!uri) {
    return res.status(500).json({ 
      error: "Configuration error", 
      message: "MONGODB_URI is not set" 
    });
  }

  let client;

  try {
    client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const posts = await collection.find({}).sort({ date: -1 }).toArray();

    const transformedPosts = posts.map((post) => ({
      ...post,
      _id: post._id.toString(),
    }));

    return res.status(200).json({ posts: transformedPosts });
  } catch (error) {
    console.error("MongoDB Error:", error);
    return res.status(500).json({ 
      error: "Database error", 
      message: error.message
    });
  } finally {
    if (client) {
      await client.close();
    }
  }
}
