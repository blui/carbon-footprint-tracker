// src/models/Organization.ts

import mongoose from "mongoose"; // Import mongoose for database interaction

// Define the schema for an organization
const OrganizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Organization name is required
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the creation date when a new organization is created
  },
  systems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "System", // Array of references to the "System" model (indicating a one-to-many relationship)
    },
  ],
});

// Create and export the Organization model based on the defined schema
const Organization = mongoose.model("Organization", OrganizationSchema);

export default Organization;
