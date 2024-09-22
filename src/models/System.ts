// src/models/System.ts

import mongoose from "mongoose"; // Import mongoose for database schema creation

// Define schema for a system (e.g., supply chain, vehicles, etc.)
const SystemSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true, // System type is required (e.g., "Supply Chain", "Vehicles")
  },
  details: {
    type: String,
    required: true, // Detailed description or information about the system
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization", // Reference to the parent organization (one-to-many relationship)
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the creation date when the system is added
  },
});

// Create and export the System model based on the defined schema
const System = mongoose.model("System", SystemSchema);

export default System;
