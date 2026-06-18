import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { createRequire } from "module";
import * as fs from "fs";

const require = createRequire(import.meta.url);

// Load .env into process.env for the local API middleware
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    if (key && !(key in process.env)) process.env[key] = val;
  }
}

// ── Local dev API middleware (mirrors Vercel Serverless Functions) ──────────
function localApiPlugin() {
  return {
    name: "local-api",
    configureServer(server: import("vite").ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || "";
        const method = req.method || "GET";

        const sendJSON = (status: number, data: unknown) => {
          res.statusCode = status;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(data));
        };

        const readBody = (): Promise<Record<string, unknown>> =>
          new Promise((resolve) => {
            const chunks: Buffer[] = [];
            req.on("data", (c: Buffer) => chunks.push(c));
            req.on("end", () => {
              try { resolve(JSON.parse(Buffer.concat(chunks).toString())); }
              catch { resolve({}); }
            });
          });

        // ── GET /api/posts.mjs — public posts ──────────────────────────────
        if (url === "/api/posts.mjs" && method === "GET") {
          try {
            const { MongoClient } = require("mongodb");
            const uri = process.env.MONGODB_URI;
            if (!uri) return sendJSON(500, { error: "MONGODB_URI not set in .env" });
            const client = new MongoClient(uri);
            await client.connect();
            const posts = await client
              .db(process.env.MONGODB_DATABASE || "portfolio")
              .collection(process.env.MONGODB_COLLECTION || "blogPosts")
              .find({ hidden: { $ne: true } }).sort({ createdAt: -1 }).toArray();
            await client.close();
            return sendJSON(200, {
              posts: posts.map((p: Record<string, unknown>) => ({ ...p, _id: String(p._id) })),
            });
          } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            console.error("[local-api] GET /api/posts.mjs →", msg);
            return sendJSON(500, { error: msg });
          }
        }

        // ── /api/admin/posts.mjs — authenticated CRUD ──────────────────────
        if (url === "/api/admin/posts.mjs") {
          const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
          const auth = (req.headers as Record<string, string>)["authorization"];
          if (!auth || auth !== `Bearer ${ADMIN_PASSWORD}`)
            return sendJSON(401, { error: "Unauthorized" });

          try {
            const { MongoClient, ObjectId } = require("mongodb");
            const uri = process.env.MONGODB_URI;
            if (!uri) return sendJSON(500, { error: "MONGODB_URI not set in .env" });
            const client = new MongoClient(uri);
            await client.connect();
            const col = client
              .db(process.env.MONGODB_DATABASE || "portfolio")
              .collection(process.env.MONGODB_COLLECTION || "blogPosts");

            if (method === "GET") {
              const all = await col.find({}).sort({ createdAt: -1 }).toArray();
              await client.close();
              return sendJSON(200, {
                posts: all.map((p: Record<string, unknown>) => ({ ...p, _id: String(p._id) })),
              });
            }

            const body = await readBody();

            if (method === "POST") {
              body.createdAt = new Date().toISOString();
              const result = await col.insertOne(body);
              await client.close();
              return sendJSON(201, { success: true, id: result.insertedId });
            }
            if (method === "PUT") {
              const { id, ...update } = body as { id: string; [k: string]: unknown };
              update.updatedAt = new Date().toISOString();
              await col.updateOne({ _id: new ObjectId(id) }, { $set: update });
              await client.close();
              return sendJSON(200, { success: true });
            }
            if (method === "PATCH") {
              const { id, hidden } = body as { id: string; hidden: boolean };
              await col.updateOne(
                { _id: new ObjectId(id) },
                { $set: { hidden: !!hidden, updatedAt: new Date().toISOString() } }
              );
              await client.close();
              return sendJSON(200, { success: true });
            }
            if (method === "DELETE") {
              const { id } = body as { id: string };
              await col.deleteOne({ _id: new ObjectId(id) });
              await client.close();
              return sendJSON(200, { success: true });
            }
            await client.close();
            return sendJSON(405, { error: "Method not allowed" });
          } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            console.error("[local-api] /api/admin/posts.mjs →", msg);
            return sendJSON(500, { error: msg });
          }
        }

        next();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    mode === "development" && localApiPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));