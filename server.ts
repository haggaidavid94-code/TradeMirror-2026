import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;
  const DB_PATH = path.join(__dirname, "db.json");

  app.use(express.json());

  // Helper to read DB
  const readDB = async () => {
    const data = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(data);
  };

  // Helper to write DB
  const writeDB = async (data: any) => {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  };

  // API Routes
  app.get("/api/trades", async (req, res) => {
    const db = await readDB();
    res.json(db.trades);
  });

  app.post("/api/trades", async (req, res) => {
    const db = await readDB();
    const newTrade = { ...req.body, id: Date.now().toString() };
    db.trades.unshift(newTrade);
    
    // Update balance
    db.userSettings.currentBalance += newTrade.pnl;
    
    await writeDB(db);
    res.status(201).json(newTrade);
  });

  app.get("/api/journal", async (req, res) => {
    const db = await readDB();
    res.json(db.journalEntries);
  });

  app.post("/api/journal", async (req, res) => {
    const db = await readDB();
    const entry = req.body;
    const index = db.journalEntries.findIndex((e: any) => e.date === entry.date);
    
    if (index > -1) {
      db.journalEntries[index] = { ...db.journalEntries[index], ...entry };
    } else {
      db.journalEntries.unshift(entry);
    }
    
    await writeDB(db);
    res.json(db.journalEntries[index > -1 ? index : 0]);
  });

  app.get("/api/settings", async (req, res) => {
    const db = await readDB();
    res.json(db.userSettings);
  });

  app.get("/api/checklist", async (req, res) => {
      const db = await readDB();
      res.json(db.readinessChecklist);
  });

  app.post("/api/checklist", async (req, res) => {
      const db = await readDB();
      db.readinessChecklist = req.body;
      await writeDB(db);
      res.json(db.readinessChecklist);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
