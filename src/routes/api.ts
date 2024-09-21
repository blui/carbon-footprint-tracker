// src/routes/api.ts

import { Router, Request, Response } from "express";
import Organization from "../models/Organization";
import System from "../models/System";

const router = Router(); // Initialize the router

// Route to create a new organization
router.post("/organizations", async (req: Request, res: Response) => {
  try {
    const { name } = req.body; // Extract the organization's name from the request body
    const newOrg = new Organization({ name }); // Create a new organization instance
    await newOrg.save(); // Save the organization to the database
    res.status(201).json(newOrg); // Respond with the newly created organization
  } catch (error) {
    res.status(500).json({ error: "Error creating organization" }); // Handle errors
  }
});

// Route to add a system to an organization
router.post(
  "/organizations/:orgId/systems",
  async (req: Request, res: Response) => {
    try {
      const { orgId } = req.params; // Extract organization ID from the URL parameters
      const { type, details } = req.body; // Extract system details from the request body

      const organization = await Organization.findById(orgId); // Find the organization by ID
      if (!organization)
        return res.status(404).json({ error: "Organization not found" }); // Handle case where organization is not found

      const newSystem = new System({ type, details, organization: orgId }); // Create a new system linked to the organization
      await newSystem.save(); // Save the system to the database

      organization.systems.push(newSystem._id); // Add system reference to the organization's systems array
      await organization.save(); // Save the updated organization

      res.status(201).json(newSystem); // Respond with the newly created system
    } catch (error) {
      res.status(500).json({ error: "Error adding system" }); // Handle errors
    }
  }
);

// Route to get all systems for a specific organization
router.get(
  "/organizations/:orgId/systems",
  async (req: Request, res: Response) => {
    try {
      const { orgId } = req.params; // Extract organization ID from the URL parameters
      const systems = await System.find({ organization: orgId }); // Find all systems for the given organization
      res.status(200).json(systems); // Respond with the list of systems
    } catch (error) {
      res.status(500).json({ error: "Error fetching systems" }); // Handle errors
    }
  }
);

// Route to get all organizations and their systems
router.get("/organizations", async (req: Request, res: Response) => {
  try {
    const organizations = await Organization.find().populate("systems"); // Fetch organizations and populate systems
    res.status(200).json(organizations); // Respond with the list of organizations and their systems
  } catch (error) {
    res.status(500).json({ error: "Error fetching organizations" }); // Handle errors
  }
});

export default router;
