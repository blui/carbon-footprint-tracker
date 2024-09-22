// src/models/System.ts

import mongoose from "mongoose"; // Import mongoose for MongoDB schema creation

// Define schema for different system types
const SystemSchema = new mongoose.Schema({
  type: { type: String, required: true }, // System type: "workflow", "vendor solution", or "vehicle"

  // Workflow type systems
  workflowItems: [
    { type: String }, // Each workflow system can contain a list of workflow items (simple strings)
  ],

  // Vendor Solution type systems
  vendorType: { type: String }, // The type of vendor solution (e.g., "software", "hardware")
  vendorName: { type: String }, // Name of the vendor providing the solution

  // Vehicle type systems
  year: { type: Number }, // The year of the vehicle
  make: { type: String }, // Vehicle make (e.g., "Toyota", "Ford")
  model: { type: String }, // Vehicle model (e.g., "Corolla", "Mustang")

  // Reference to the organization that the system belongs to
  organization: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" }, // Establish a reference to the Organization model

  createdAt: { type: Date, default: Date.now }, // Automatically set the creation date for each system
});

// Create the System model based on the schema
const System = mongoose.model("System", SystemSchema);

export default System; // Export the model for use in other parts of the app
