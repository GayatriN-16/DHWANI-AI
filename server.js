import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { MOCK_INCIDENTS } from "./src/data.js";

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "db.json");

// Ensure db.json exists with initial data
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ incidents: MOCK_INCIDENTS }, null, 2));
}

app.use(express.json());

// API: Get all incidents
app.get("/api/incidents", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
    res.json(data.incidents || []);
  } catch (error) {
    res.status(500).json({ error: "Failed to read database" });
  }
});

// API: Create new incident
app.post("/api/incidents", (req, res) => {
  try {
    const newIncident = req.body;
    const data = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
    const list = data.incidents || [];
    
    // Add to list
    list.unshift(newIncident);
    fs.writeFileSync(DB_FILE, JSON.stringify({ incidents: list }, null, 2));
    
    res.status(201).json(newIncident);
  } catch (error) {
    res.status(500).json({ error: "Failed to save incident" });
  }
});

// API: Delete an incident
app.delete("/api/incidents/:id", (req, res) => {
  try {
    const { id } = req.params;
    const data = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
    const list = data.incidents || [];
    
    const filtered = list.filter((item) => item.id !== id);
    fs.writeFileSync(DB_FILE, JSON.stringify({ incidents: filtered }, null, 2));
    
    res.json({ success: true, message: "Incident deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete incident" });
  }
});

// API: Real-time Out-of-band Simulated Identity Verification
app.post("/api/verify-identity", (req, res) => {
  const { code, contactName } = req.body;
  
  // Simulate standard security token flow
  setTimeout(() => {
    res.json({
      success: true,
      verificationToken: "TOK-" + Math.random().toString(36).substring(3, 9).toUpperCase(),
      timestamp: new Date().toISOString(),
      authorized: true,
      stepsCompleted: [
        "Trusted Contact Handshake Initiated",
        `Secure SMS dispatch to verified number registered to ${contactName || "Rajesh"}`,
        "Fallback verification vector confirmed via registered device biometric hash"
      ]
    });
  }, 1000); // simulate realistic network handshake
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString(), system: "DhwaniAI Core" });
});

async function startServer() {
  // Vite dev server integration in development mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[DhwaniAI Backend] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
