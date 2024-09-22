import { Router, Request, Response } from "express"; // Import Express Router and types
import Organization from "../models/Organization"; // Import Organization model
import System from "../models/System"; // Import System model

const router = Router(); // Initialize the Express router

// Route to create a new organization
router.post("/organizations", async (req: Request, res: Response) => {
  try {
    const { name } = req.body; // Extract the organization name from the request body
    const newOrg = new Organization({ name }); // Create a new organization instance
    await newOrg.save(); // Save the organization to the database
    res.status(201).json(newOrg); // Respond with the created organization
  } catch (error) {
    res.status(500).json({ error: "Error creating organization" }); // Error handling
  }
});

// Route to get all organizations and their associated systems
router.get("/organizations", async (req: Request, res: Response) => {
  try {
    const organizations = await Organization.find().populate("systems"); // Find all organizations and populate systems
    res.status(200).json(organizations); // Respond with the organizations
  } catch (error) {
    res.status(500).json({ error: "Error fetching organizations" }); // Error handling
  }
});

// Route to get a specific organization by ID
router.get("/organizations/:orgId", async (req: Request, res: Response) => {
  try {
    const { orgId } = req.params; // Extract the organization ID from the URL params
    const organization = await Organization.findById(orgId).populate("systems"); // Find organization by ID and populate systems
    if (!organization)
      return res.status(404).json({ error: "Organization not found" }); // If no organization found, return error
    res.status(200).json(organization); // Respond with the organization data
  } catch (error) {
    res.status(500).json({ error: "Error fetching organization" }); // Error handling
  }
});

// Route to update an organization's name
router.put("/organizations/:orgId", async (req: Request, res: Response) => {
  try {
    const { orgId } = req.params; // Extract organization ID from the URL params
    const { name } = req.body; // Extract the updated name from the request body
    const updatedOrg = await Organization.findByIdAndUpdate(
      orgId,
      { name },
      { new: true }
    ); // Update organization name
    if (!updatedOrg)
      return res.status(404).json({ error: "Organization not found" }); // If organization not found
    res.status(200).json(updatedOrg); // Respond with the updated organization data
  } catch (error) {
    res.status(500).json({ error: "Error updating organization" }); // Error handling
  }
});

// Route to delete an organization and its associated systems
router.delete("/organizations/:orgId", async (req: Request, res: Response) => {
  try {
    const { orgId } = req.params; // Extract organization ID from the URL params
    const deletedOrg = await Organization.findByIdAndDelete(orgId); // Delete the organization
    if (!deletedOrg)
      return res.status(404).json({ error: "Organization not found" }); // If organization not found
    await System.deleteMany({ organization: orgId }); // Delete all systems associated with this organization
    res
      .status(200)
      .json({ message: "Organization and related systems deleted" }); // Success response
  } catch (error) {
    res.status(500).json({ error: "Error deleting organization" }); // Error handling
  }
});

// Route to add a system to an organization
router.post(
  "/organizations/:orgId/systems",
  async (req: Request, res: Response) => {
    try {
      const { orgId } = req.params; // Extract organization ID from URL params
      const { type, workflowItems, vendorType, vendorName, year, make, model } =
        req.body; // Extract system details

      const organization = await Organization.findById(orgId); // Find the organization
      if (!organization)
        return res.status(404).json({ error: "Organization not found" }); // If organization not found

      let systemData: any = { type, organization: orgId }; // Prepare base system data

      // Check the type of system and add relevant data
      if (type === "workflow") {
        systemData.workflowItems = workflowItems;
      } else if (type === "vendorSolution") {
        systemData.vendorType = vendorType;
        systemData.vendorName = vendorName;
      } else if (type === "vehicle") {
        systemData.year = year;
        systemData.make = make;
        systemData.model = model;
      }

      const newSystem = new System(systemData); // Create a new system instance
      await newSystem.save(); // Save the system to the database

      organization.systems.push(newSystem._id); // Add system to organization's systems array
      await organization.save(); // Save the updated organization

      res.status(201).json(newSystem); // Respond with the newly created system
    } catch (error) {
      res.status(500).json({ error: "Error adding system" }); // Error handling
    }
  }
);

// Route to get all systems for a specific organization
router.get(
  "/organizations/:orgId/systems",
  async (req: Request, res: Response) => {
    try {
      const { orgId } = req.params; // Extract organization ID from URL params
      const systems = await System.find({ organization: orgId }); // Find all systems related to the organization
      res.status(200).json(systems); // Respond with the systems
    } catch (error) {
      res.status(500).json({ error: "Error fetching systems" }); // Error handling
    }
  }
);

// Route to update a specific system
router.put(
  "/organizations/:orgId/systems/:systemId",
  async (req: Request, res: Response) => {
    try {
      const { systemId } = req.params; // Extract system ID from URL params
      const { type, workflowItems, vendorType, vendorName, year, make, model } =
        req.body; // Extract system details

      let systemData: any = { type }; // Prepare base system data

      // Check the type of system and update relevant data
      if (type === "workflow") {
        systemData.workflowItems = workflowItems;
      } else if (type === "vendorSolution") {
        systemData.vendorType = vendorType;
        systemData.vendorName = vendorName;
      } else if (type === "vehicle") {
        systemData.year = year;
        systemData.make = make;
        systemData.model = model;
      }

      const updatedSystem = await System.findByIdAndUpdate(
        systemId,
        systemData,
        { new: true }
      ); // Update the system
      if (!updatedSystem)
        return res.status(404).json({ error: "System not found" }); // If system not found

      res.status(200).json(updatedSystem); // Respond with the updated system
    } catch (error) {
      res.status(500).json({ error: "Error updating system" }); // Error handling
    }
  }
);

// Route to delete a specific system
router.delete(
  "/organizations/:orgId/systems/:systemId",
  async (req: Request, res: Response) => {
    try {
      const { systemId } = req.params; // Extract system ID from URL params
      const deletedSystem = await System.findByIdAndDelete(systemId); // Delete the system
      if (!deletedSystem)
        return res.status(404).json({ error: "System not found" }); // If system not found

      res.status(200).json({ message: "System deleted" }); // Respond with success message
    } catch (error) {
      res.status(500).json({ error: "Error deleting system" }); // Error handling
    }
  }
);

export default router; // Export the router
