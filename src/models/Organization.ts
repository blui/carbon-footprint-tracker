// src/models/Organization.ts

import mongoose from "mongoose"; // Import mongoose for MongoDB schema and model creation
import System from "./System"; // Import the System model to manage associations

// Define the schema for an organization
const OrganizationSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Organization name (required field)
  createdAt: { type: Date, default: Date.now }, // Automatically set creation date when a new organization is created
  systems: [{ type: mongoose.Schema.Types.ObjectId, ref: "System" }], // Array of references to System model (establishes a one-to-many relationship)
});

// Middleware to delete associated systems when an organization is deleted
// This pre-hook is triggered before the `findOneAndDelete` MongoDB operation
OrganizationSchema.pre("findOneAndDelete", async function (next) {
  const org = await this.model.findOne(this.getFilter()); // Retrieve the organization being deleted
  if (org) {
    await System.deleteMany({ organization: org._id }); // Delete all systems linked to this organization
  }
  next(); // Proceed to delete the organization after the systems are removed
});

// Create the Organization model from the schema
const Organization = mongoose.model("Organization", OrganizationSchema);

export default Organization; // Export the model to use it elsewhere in the app
