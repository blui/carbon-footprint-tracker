// src/models/Organization.ts

import mongoose from "mongoose";
import System from "./System"; // Import the System model

// Define schema for an organization
const OrganizationSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Organization name (required)
  createdAt: { type: Date, default: Date.now }, // Creation date
  systems: [{ type: mongoose.Schema.Types.ObjectId, ref: "System" }], // Systems associated with this organization
});

// Middleware to delete associated systems when an organization is deleted
OrganizationSchema.pre("findOneAndDelete", async function (next) {
  const org = await this.model.findOne(this.getFilter()); // Find the organization being deleted
  if (org) {
    await System.deleteMany({ organization: org._id }); // Delete all systems associated with the organization
  }
  next();
});

// Create the Organization model based on the schema
const Organization = mongoose.model("Organization", OrganizationSchema);

export default Organization;
