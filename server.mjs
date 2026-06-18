/**
 * Production server for Docker deployments.
 * Serves the Vite static build AND handles /api/* routes
 * (mirrors the Vercel serverless functions in api/).
 */
import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));

const PORT        = process.env.PORT              || 3000;
const MONGO_URI   = process.env.MONGODB_URI;
const DB_NAME     = process.env.MONGODB_DATABASE  || "portfolio";
const COLLECTION  = process.env.MONGODB_COLLECTION || "blogPosts";
const ADMIN_PASS  = process.env.ADMIN_PASSWORD     || "admin123";

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json({ limit: "50mb" }));          // large limit for base64 images
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();
  next();
});

// ── MongoDB helper ────────────────────────────────────────────────────────────
async function withMongo(fn) {
  if (!MONGO_URI) throw new Error("MONGODB_URI is not set");
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const col = client.db(DB_NAME).collection(COLLECTION);
    return await fn(col);
  } finally {
    await client.close();
  }
}

// ── Public API: GET /api/posts.mjs ───────────────────────────────────────────
app.get("/api/posts.mjs", async (_req, res) => {
  try {
    const posts = await withMongo((col) =>
      col.find({ hidden: { $ne: true } }).sort({ createdAt: -1 }).toArray()
    );
    const transformed = posts.map((p) => ({ ...p, _id: p._id.toString() }));
    res.json({ posts: transformed });
  } catch (err) {
    console.error("[GET /api/posts.mjs]", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Admin API: POST / PUT / DELETE /api/admin/posts.mjs ─────────────────────
app.all("/api/admin/posts.mjs", async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || auth !== `Bearer ${ADMIN_PASS}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    if (req.method === "GET") {
      const posts = await withMongo((col) =>
        col.find({}).sort({ createdAt: -1 }).toArray()
      );
      const transformed = posts.map((p) => ({ ...p, _id: p._id.toString() }));
      return res.json({ posts: transformed });
    }

    if (req.method === "POST") {
      const post = { ...req.body, createdAt: new Date().toISOString() };
      const result = await withMongo((col) => col.insertOne(post));
      return res.status(201).json({ success: true, id: result.insertedId });
    }

    if (req.method === "PUT") {
      const { id, ...updateData } = req.body;
      if (!id) return res.status(400).json({ error: "Post ID required" });
      updateData.updatedAt = new Date().toISOString();
      await withMongo((col) =>
        col.updateOne({ _id: new ObjectId(id) }, { $set: updateData })
      );
      return res.json({ success: true });
    }

    if (req.method === "PATCH") {
      const { id, hidden } = req.body;
      if (!id) return res.status(400).json({ error: "Post ID required" });
      await withMongo((col) =>
        col.updateOne(
          { _id: new ObjectId(id) },
          { $set: { hidden: !!hidden, updatedAt: new Date().toISOString() } }
        )
      );
      return res.json({ success: true });
    }

    if (req.method === "DELETE") {
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: "Post ID required" });
      await withMongo((col) =>
        col.deleteOne({ _id: new ObjectId(id) })
      );
      return res.json({ success: true });
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("[/api/admin/posts.mjs]", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Static files (Vite build) ────────────────────────────────────────────────
const distPath = join(__dirname, "dist");
if (!existsSync(distPath)) {
  console.error('❌  "dist" folder not found. Run `npm run build` first.');
  process.exit(1);
}
app.use(express.static(distPath, { maxAge: "1y", immutable: true }));

// ── SPA fallback (React Router) ──────────────────────────────────────────────
app.get("*", (_req, res) => {
  res.sendFile(join(distPath, "index.html"));
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅  Server running → http://localhost:${PORT}`);
  console.log(`   MongoDB : ${MONGO_URI ? "connected" : "⚠️  MONGODB_URI not set"}`);
});
