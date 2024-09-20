// src/models/Organization.ts

import mongoose from "mongoose";

// Define schema for an organization
const OrganizationSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Organization name
  createdAt: { type: Date, default: Date.now }, // Creation date
  systems: [{ type: mongoose.Schema.Types.ObjectId, ref: "System" }], // Systems within the organization
});

// Create the Organization model
const Organization = mongoose.model("Organization", OrganizationSchema);

export default Organization;
