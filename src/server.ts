// src/server.ts

import express, { Request, Response } from "express"; // Import express and types for Request/Response
import cors from "cors"; // Import CORS for handling cross-origin requests
import apiRoutes from "./routes/api"; // Import the API routes module
import "./db"; // Import the MongoDB connection (connects automatically)

const app = express(); // Initialize the Express application
const port = process.env.PORT || 3000; // Set the port (use environment variable or fallback to 3000)

// Apply middleware
app.use(cors()); // Enable CORS for handling cross-origin requests
app.use(express.json()); // Middleware to parse incoming JSON request bodies

// Route handling
app.use("/api", apiRoutes); // Use the API routes, all prefixed with '/api'

// Root route (for API health check or simple response)
app.get("/", (req: Request, res: Response) => {
  res.send("Carbon Footprint Tracker API is up and running!"); // Simple health check
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`); // Log the port the server is running on
});
