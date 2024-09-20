// src/models/System.ts

import mongoose from "mongoose";

// Define schema for a system (e.g., supply chain, vehicles, etc.)
const SystemSchema = new mongoose.Schema({
  type: { type: String, required: true }, // Type of system
  details: { type: String, required: true }, // Details provided by the user
  organization: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" }, // Reference to organization
  createdAt: { type: Date, default: Date.now }, // Creation date
});

// Create the System model
const System = mongoose.model("System", SystemSchema);

export default System;
