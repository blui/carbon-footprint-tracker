// src/models/Organization.ts

import mongoose from "mongoose";

// Define schema for an organization
const OrganizationSchema = new mongoose.Schema({
  name: { type: String, required: true }, // The organization's name (required field)
  createdAt: { type: Date, default: Date.now }, // Automatically set creation date when a new document is created
  systems: [{ type: mongoose.Schema.Types.ObjectId, ref: "System" }], // Array of references to the "System" model (one-to-many relationship)
});

// Create the Organization model based on the schema
const Organization = mongoose.model("Organization", OrganizationSchema);

export default Organization;
