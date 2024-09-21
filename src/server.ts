// src/server.ts

import express, { Request, Response } from "express"; // Import express and types for Request/Response
import cors from "cors"; // Import CORS for cross-origin requests
import apiRoutes from "./routes/api"; // Import API routes
import "./db"; // Import MongoDB connection (automatically connects when the file is imported)

const app = express(); // Initialize an Express application
const port = process.env.PORT || 3000; // Use the port from environment variables or default to 3000

// Middleware to enable CORS (allows cross-origin requests)
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(express.json());

// API route middleware (all routes prefixed with "/api")
app.use("/api", apiRoutes);

// Root route for checking server health
app.get("/", (req: Request, res: Response) => {
  res.send("Carbon Footprint Tracker API is up and running!"); // Simple health check response
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`); // Log server start message
});
