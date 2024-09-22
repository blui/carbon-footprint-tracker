// src/db.ts

import mongoose from "mongoose"; // Import mongoose for MongoDB connection

// Define the MongoDB connection URI (you can also make this configurable with environment variables)
const mongoURI = "mongodb://localhost:27017/carbonFootprintDB";

// Establish a connection to MongoDB using the mongoose library
mongoose
  .connect(mongoURI) // Use the defined URI to connect to the MongoDB database
  .then(() => console.log("MongoDB connected successfully")) // Log a success message if the connection is successful
  .catch((err) => console.error(`MongoDB connection error: ${err}`)); // Log any connection errors

// Export the mongoose instance so it can be used in other parts of the application
export default mongoose;
