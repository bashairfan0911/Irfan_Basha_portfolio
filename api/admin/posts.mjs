import { MongoClient, ObjectId } from "mongodb";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Check authorization
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${ADMIN_PASSWORD}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DATABASE || "portfolio";
  const collectionName = process.env.MONGODB_COLLECTION || "blogPosts";

  if (!uri) {
    return res.status(500).json({ error: "MONGODB_URI is not set" });
  }

  let client;

  try {
    client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // CREATE
    if (req.method === "POST") {
      const post = req.body;
      post.createdAt = new Date().toISOString();
      const result = await collection.insertOne(post);
      return res.status(201).json({ success: true, id: result.insertedId });
    }

    // UPDATE
    if (req.method === "PUT") {
      const { id, ...updateData } = req.body;
      if (!id) {
        return res.status(400).json({ error: "Post ID required" });
      }
      updateData.updatedAt = new Date().toISOString();
      await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );
      return res.status(200).json({ success: true });
    }

    // DELETE
    if (req.method === "DELETE") {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ error: "Post ID required" });
      }
      await collection.deleteOne({ _id: new ObjectId(id) });
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Admin API Error:", error);
    return res.status(500).json({ error: error.message });
  } finally {
    if (client) {
      await client.close();
    }
  }
}
