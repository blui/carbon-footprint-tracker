// src/server.ts

// Importing necessary modules from Express
import express, { Request, Response } from "express";

// Importing API routes
import apiRoutes from "./routes/api";

// Initializing an Express application
const app = express();

// Setting the port, defaulting to 3000 if no environment variable is set
const port = process.env.PORT || 3000;

// Middleware to parse incoming JSON requests
app.use(express.json()); // Allows the app to accept and handle JSON data

// Defining a route for all API-related endpoints
app.use("/api", apiRoutes);

// Basic route to check if the server is running
app.get("/", (req: Request, res: Response) => {
  res.send("Carbon Footprint Tracker API is up and running!");
});

// Starting the server and listening on the defined port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
