// src/models/System.ts

import mongoose from "mongoose";

// Define schema for a system (e.g., supply chain, vehicles, etc.)
const SystemSchema = new mongoose.Schema({
  type: { type: String, required: true }, // The type of the system (e.g., "Supply Chain", "Vehicles") - required field
  details: { type: String, required: true }, // Detailed description or information about the system - required field
  organization: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" }, // Reference to the parent organization (one-to-many relationship)
  createdAt: { type: Date, default: Date.now }, // Automatically set the creation date when a new system is added
});

// Create the System model from the schema
const System = mongoose.model("System", SystemSchema);

export default System;
