// src/routes/api.ts

import { Router, Request, Response } from "express"; // Import Express Router and types for Request/Response
import Organization from "../models/Organization"; // Import Organization model
import System from "../models/System"; // Import System model

const router = Router(); // Create a new Express Router

// CREATE Organization - Handles creating a new organization
router.post("/organizations", async (req: Request, res: Response) => {
  try {
    const { name } = req.body; // Extract organization name from the request body
    const newOrg = new Organization({ name }); // Create a new Organization instance
    await newOrg.save(); // Save the new organization to the database
    res.status(201).json(newOrg); // Return the newly created organization with a 201 status
  } catch (error) {
    res.status(500).json({ error: "Error creating organization" }); // Send 500 error on failure
  }
});

// READ All Organizations - Fetches all organizations from the database
router.get("/organizations", async (req: Request, res: Response) => {
  try {
    // Find all organizations and populate their systems
    const organizations = await Organization.find().populate("systems");
    res.status(200).json(organizations); // Return the organizations with a 200 status
  } catch (error) {
    res.status(500).json({ error: "Error fetching organizations" }); // Send 500 error on failure
  }
});

// READ One Organization - Fetch a specific organization by ID
router.get("/organizations/:orgId", async (req: Request, res: Response) => {
  try {
    const { orgId } = req.params; // Extract organization ID from the request parameters
    // Find the organization by its ID and populate its systems
    const organization = await Organization.findById(orgId).populate("systems");
    if (!organization) {
      return res.status(404).json({ error: "Organization not found" }); // Return 404 if organization not found
    }
    res.status(200).json(organization); // Return the organization with a 200 status
  } catch (error) {
    res.status(500).json({ error: "Error fetching organization" }); // Send 500 error on failure
  }
});

// UPDATE Organization - Update an organization's details
router.put("/organizations/:orgId", async (req: Request, res: Response) => {
  try {
    const { orgId } = req.params; // Extract organization ID from the request parameters
    const { name } = req.body; // Extract the updated name from the request body
    // Find and update the organization, returning the updated document
    const updatedOrg = await Organization.findByIdAndUpdate(
      orgId,
      { name },
      { new: true }
    );
    if (!updatedOrg) {
      return res.status(404).json({ error: "Organization not found" }); // Return 404 if organization not found
    }
    res.status(200).json(updatedOrg); // Return the updated organization with a 200 status
  } catch (error) {
    res.status(500).json({ error: "Error updating organization" }); // Send 500 error on failure
  }
});

// DELETE Organization - Delete an organization by its ID
router.delete("/organizations/:orgId", async (req: Request, res: Response) => {
  try {
    const { orgId } = req.params; // Extract organization ID from the request parameters
    // Find and delete the organization
    const deletedOrg = await Organization.findByIdAndDelete(orgId);
    if (!deletedOrg) {
      return res.status(404).json({ error: "Organization not found" }); // Return 404 if organization not found
    }
    res.status(200).json({ message: "Organization deleted" }); // Return success message with 200 status
  } catch (error) {
    res.status(500).json({ error: "Error deleting organization" }); // Send 500 error on failure
  }
});

// CREATE System - Adds a system to a specific organization
router.post(
  "/organizations/:orgId/systems",
  async (req: Request, res: Response) => {
    try {
      const { orgId } = req.params; // Extract organization ID from the request parameters
      const { type, details } = req.body; // Extract system details from the request body
      const organization = await Organization.findById(orgId); // Find the organization by ID
      if (!organization) {
        return res.status(404).json({ error: "Organization not found" }); // Return 404 if organization not found
      }
      const newSystem = new System({ type, details, organization: orgId }); // Create a new System instance
      await newSystem.save(); // Save the new system to the database
      organization.systems.push(newSystem._id); // Add the new system to the organization
      await organization.save(); // Save the updated organization
      res.status(201).json(newSystem); // Return the new system with a 201 status
    } catch (error) {
      res.status(500).json({ error: "Error adding system" }); // Send 500 error on failure
    }
  }
);

// READ All Systems for an Organization - Fetch all systems for a specific organization
router.get(
  "/organizations/:orgId/systems",
  async (req: Request, res: Response) => {
    try {
      const { orgId } = req.params; // Extract organization ID from the request parameters
      const systems = await System.find({ organization: orgId }); // Find all systems associated with the organization
      res.status(200).json(systems); // Return the systems with a 200 status
    } catch (error) {
      res.status(500).json({ error: "Error fetching systems" }); // Send 500 error on failure
    }
  }
);

// UPDATE System - Update a system's details within an organization
router.put(
  "/organizations/:orgId/systems/:systemId",
  async (req: Request, res: Response) => {
    try {
      const { systemId } = req.params; // Extract system ID from the request parameters
      const { type, details } = req.body; // Extract updated system details from the request body
      // Find and update the system, returning the updated document
      const updatedSystem = await System.findByIdAndUpdate(
        systemId,
        { type, details },
        { new: true }
      );
      if (!updatedSystem) {
        return res.status(404).json({ error: "System not found" }); // Return 404 if system not found
      }
      res.status(200).json(updatedSystem); // Return the updated system with a 200 status
    } catch (error) {
      res.status(500).json({ error: "Error updating system" }); // Send 500 error on failure
    }
  }
);

// DELETE System - Delete a system from an organization
router.delete(
  "/organizations/:orgId/systems/:systemId",
  async (req: Request, res: Response) => {
    try {
      const { systemId } = req.params; // Extract system ID from the request parameters
      // Find and delete the system
      const deletedSystem = await System.findByIdAndDelete(systemId);
      if (!deletedSystem) {
        return res.status(404).json({ error: "System not found" }); // Return 404 if system not found
      }
      res.status(200).json({ message: "System deleted" }); // Return success message with 200 status
    } catch (error) {
      res.status(500).json({ error: "Error deleting system" }); // Send 500 error on failure
    }
  }
);

export default router;
