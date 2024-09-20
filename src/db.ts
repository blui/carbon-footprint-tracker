// src/db.ts

import mongoose from "mongoose";

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/carbonFootprintDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Event handlers for the MongoDB connection
mongoose.connection.on("connected", () => {
  console.log("MongoDB connected");
});

mongoose.connection.on("error", (err) => {
  console.log(`MongoDB connection error: ${err}`);
});

export default mongoose;
