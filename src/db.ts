// src/db.ts

import mongoose from "mongoose";

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/carbonFootprintDB")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(`MongoDB connection error: ${err}`));

export default mongoose;
