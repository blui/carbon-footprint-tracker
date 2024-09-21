// src/db.ts

import mongoose from "mongoose";

// Define the MongoDB connection URI
const mongoURI = "mongodb://localhost:27017/carbonFootprintDB";

// Establish a connection to MongoDB using mongoose
mongoose
  .connect(mongoURI) // Use the defined connection URI to connect to the database
  .then(() => console.log("MongoDB connected")) // Log a success message upon successful connection
  .catch((err) => console.log(`MongoDB connection error: ${err}`)); // Catch and log any connection errors

// Export the mongoose instance to be used in other parts of the application
export default mongoose;
