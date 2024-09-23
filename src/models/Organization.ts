// src/models/Organization.ts

import mongoose from "mongoose";
import System from "./System";

const OrganizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  systems: [{ type: mongoose.Schema.Types.ObjectId, ref: "System" }],
});

OrganizationSchema.pre("findOneAndDelete", async function (next) {
  const org = await this.model.findOne(this.getFilter());
  if (org) {
    await System.deleteMany({ organization: org._id });
  }
  next();
});

const Organization = mongoose.model("Organization", OrganizationSchema);
export default Organization;
