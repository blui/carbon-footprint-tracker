// src/server.ts

import express, { Request, Response } from "express";
import cors from "cors"; // Import CORS
import apiRoutes from "./routes/api";
import "./db"; // Import MongoDB connection

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors());
app.use(express.json()); // Parse JSON payloads

// Use API routes
app.use("/api", apiRoutes);

// Root route for API health check
app.get("/", (req: Request, res: Response) => {
  res.send("Carbon Footprint Tracker API is up and running!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
