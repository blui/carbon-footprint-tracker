// src/models/System.ts

import mongoose from "mongoose"; // Import mongoose for MongoDB schema creation

const SystemSchema = new mongoose.Schema({
  type: { type: String, required: true }, // System type: workflow, vendorSolution, vehicle
  workflowItems: [{ type: String }], // For workflow systems
  vendorType: { type: String }, // For vendor solutions
  vendorName: { type: String }, // For vendor solutions
  year: { type: Number }, // For vehicle systems
  make: { type: String }, // For vehicle systems
  model: { type: String }, // For vehicle systems
  organization: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" },
  createdAt: { type: Date, default: Date.now },
});

const System = mongoose.model("System", SystemSchema);
export default System;
