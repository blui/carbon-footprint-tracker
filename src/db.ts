// src/db.ts

import mongoose from "mongoose"; // Import mongoose for connecting to MongoDB

// Define the MongoDB connection URI (you can replace with process.env.MONGO_URI for flexibility)
const mongoURI =
  process.env.MONGO_URI || "mongodb://localhost:27017/carbonFootprintDB";

// Establish a connection to MongoDB using the mongoose library
mongoose
  .connect(mongoURI) // Connect to the MongoDB database
  .then(() => console.log("MongoDB connected successfully")) // Log success message upon successful connection
  .catch((err) => console.error(`MongoDB connection error: ${err}`)); // Log any connection errors

// Export the mongoose instance so it can be used throughout the app
export default mongoose;
