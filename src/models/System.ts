// src/models/System.ts

import mongoose from "mongoose"; // Import mongoose for MongoDB schema creation

const SystemSchema = new mongoose.Schema({
  type: { type: String, required: true }, // System type: 'workflowSystem', 'vendorSystem', 'vehicleSystem'

  // Parameters for each system type
  workflowSystem: {
    name: { type: String }, // Name of the workflow
    workflow: { type: String }, // Workflow description or steps
  },
  vendorSystem: {
    name: { type: String }, // Vendor name
    classification: { type: String }, // Vendor classification
  },
  vehicleSystem: {
    year: { type: Number }, // Year of the vehicle
    make: { type: String }, // Make of the vehicle
    model: { type: String }, // Model of the vehicle
  },
  organization: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" }, // Reference to organization
  createdAt: { type: Date, default: Date.now }, // Automatically set creation date
});

const System = mongoose.model("System", SystemSchema);
export default System;
