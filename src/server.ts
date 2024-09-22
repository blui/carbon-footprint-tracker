// src/server.ts

import express, { Request, Response } from "express"; // Import Express and types for handling requests and responses
import cors from "cors"; // Import CORS for handling cross-origin requests
import apiRoutes from "./routes/api"; // Import the API routes
import "./db"; // Import the MongoDB connection (auto-connect on import)

const app = express(); // Create an Express application
const port = process.env.PORT || 3000; // Define the port, either from environment variables or fallback to 3000

// Apply middleware
app.use(cors()); // Enable CORS to allow cross-origin requests (important for frontend-backend communication)
app.use(express.json()); // Parse incoming request bodies in JSON format

// Set up API routes
app.use("/api", apiRoutes); // All API routes will be prefixed with '/api'

// Health check route (can be used to verify if the API is running)
app.get("/", (req: Request, res: Response) => {
  res.send("Carbon Footprint Tracker API is up and running!"); // Respond with a simple message for a root request
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`); // Log that the server is up and running
});
