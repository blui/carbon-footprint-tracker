// src/server.ts

import express, { Request, Response } from "express";
import apiRoutes from "./routes/api";
import "./db"; // Import MongoDB connection

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON payloads
app.use("/api", apiRoutes); // Use API routes

// Root route to check if the server is running
app.get("/", (req: Request, res: Response) => {
  res.send("Carbon Footprint Tracker API is up and running!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
