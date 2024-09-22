import mongoose from "mongoose";

// Define schema for different system types
const SystemSchema = new mongoose.Schema({
  type: { type: String, required: true }, // System type: workflow, vendor solution, or vehicle

  // For Workflow
  workflowItems: [
    { type: String }, // Workflow can contain a list of items (strings)
  ],

  // For Vendor Solution
  vendorType: { type: String }, // Type of vendor solution (e.g., software, hardware)
  vendorName: { type: String }, // Vendor name

  // For Vehicle
  year: { type: Number }, // Year of the vehicle
  make: { type: String }, // Make of the vehicle (e.g., Toyota, Ford)
  model: { type: String }, // Model of the vehicle (e.g., Corolla, Mustang)

  organization: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" }, // Reference to organization
  createdAt: { type: Date, default: Date.now }, // Automatically set the creation date
});

// Create the System model
const System = mongoose.model("System", SystemSchema);

export default System;
