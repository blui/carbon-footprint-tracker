import { Router, Request, Response } from "express"; // Importing Express Router and types
import Organization from "../models/Organization"; // Import the Organization model
import System from "../models/System"; // Import the System model

const router = Router(); // Initialize router for handling API routes

// Route to create a new organization
router.post("/organizations", async (req: Request, res: Response) => {
  try {
    const { name } = req.body; // Destructure the 'name' from request body
    const newOrg = new Organization({ name }); // Create a new organization object
    await newOrg.save(); // Save the organization to the database
    res.status(201).json(newOrg); // Respond with the newly created organization
  } catch (error) {
    res.status(500).json({ error: "Error creating organization" }); // Handle any errors
  }
});

// Route to get all organizations and their systems
router.get("/organizations", async (req: Request, res: Response) => {
  try {
    // Fetch all organizations and populate their related systems
    const organizations = await Organization.find().populate("systems");
    res.status(200).json(organizations); // Respond with the organizations
  } catch (error) {
    res.status(500).json({ error: "Error fetching organizations" }); // Handle any errors
  }
});

// Route to get a specific organization by ID
router.get("/organizations/:orgId", async (req: Request, res: Response) => {
  try {
    const { orgId } = req.params; // Destructure the organization ID from URL parameters
    const organization = await Organization.findById(orgId).populate("systems"); // Find organization by ID
    if (!organization) {
      return res.status(404).json({ error: "Organization not found" }); // Handle case where org is not found
    }
    res.status(200).json(organization); // Respond with the organization
  } catch (error) {
    res.status(500).json({ error: "Error fetching organization" }); // Handle any errors
  }
});

// Route to update an organization
router.put("/organizations/:orgId", async (req: Request, res: Response) => {
  try {
    const { orgId } = req.params; // Destructure the organization ID from URL parameters
    const { name } = req.body; // Destructure the new name from request body
    const updatedOrg = await Organization.findByIdAndUpdate(
      orgId,
      { name }, // Update the organization's name
      { new: true }
    );
    if (!updatedOrg) {
      return res.status(404).json({ error: "Organization not found" });
    }
    res.status(200).json(updatedOrg); // Respond with the updated organization
  } catch (error) {
    res.status(500).json({ error: "Error updating organization" });
  }
});

// Route to delete an organization and its associated systems
router.delete("/organizations/:orgId", async (req: Request, res: Response) => {
  try {
    const { orgId } = req.params; // Destructure the organization ID from URL parameters
    const deletedOrg = await Organization.findByIdAndDelete(orgId); // Delete the organization

    // If organization is found and deleted, delete associated systems
    if (deletedOrg) {
      await System.deleteMany({ organization: orgId }); // Delete all systems related to the organization
    } else {
      return res.status(404).json({ error: "Organization not found" });
    }

    res
      .status(200)
      .json({ message: "Organization and related systems deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting organization" });
  }
});

// Route to add a system to an organization
router.post(
  "/organizations/:orgId/systems",
  async (req: Request, res: Response) => {
    try {
      const { orgId } = req.params; // Destructure the organization ID from URL parameters
      const { type, workflowItems, vendorType, vendorName, year, make, model } =
        req.body; // Destructure fields based on system type

      const organization = await Organization.findById(orgId); // Find the organization by ID
      if (!organization) {
        return res.status(404).json({ error: "Organization not found" });
      }

      // Prepare the system data based on the type of system being added
      let systemData: any = { type, organization: orgId }; // Base data

      // If the system type is "workflow", add workflow items
      if (type === "workflow") {
        systemData.workflowItems = workflowItems;
      }
      // If the system type is "vendor solution", add vendor details
      else if (type === "vendorSolution") {
        systemData.vendorType = vendorType;
        systemData.vendorName = vendorName;
      }
      // If the system type is "vehicle", add vehicle details
      else if (type === "vehicle") {
        systemData.year = year;
        systemData.make = make;
        systemData.model = model;
      }

      const newSystem = new System(systemData); // Create a new system object
      await newSystem.save(); // Save the system to the database

      // Add the system to the organization's systems array
      organization.systems.push(newSystem._id);
      await organization.save(); // Save the updated organization

      res.status(201).json(newSystem); // Respond with the newly created system
    } catch (error) {
      res.status(500).json({ error: "Error adding system" }); // Handle any errors
    }
  }
);

// Route to get all systems for a specific organization
router.get(
  "/organizations/:orgId/systems",
  async (req: Request, res: Response) => {
    try {
      const { orgId } = req.params; // Destructure the organization ID from URL parameters
      const systems = await System.find({ organization: orgId }); // Fetch systems associated with the organization
      res.status(200).json(systems); // Respond with the systems
    } catch (error) {
      res.status(500).json({ error: "Error fetching systems" });
    }
  }
);

// Route to update a specific system
router.put(
  "/organizations/:orgId/systems/:systemId",
  async (req: Request, res: Response) => {
    try {
      const { systemId } = req.params; // Destructure the system ID from URL parameters
      const { type, workflowItems, vendorType, vendorName, year, make, model } =
        req.body; // Destructure fields based on system type

      // Prepare updated system data
      let systemData: any = { type }; // Base data

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
      ); // Update the system with the new data

      if (!updatedSystem) {
        return res.status(404).json({ error: "System not found" });
      }

      res.status(200).json(updatedSystem); // Respond with the updated system
    } catch (error) {
      res.status(500).json({ error: "Error updating system" });
    }
  }
);

// Route to delete a specific system
router.delete(
  "/organizations/:orgId/systems/:systemId",
  async (req: Request, res: Response) => {
    try {
      const { systemId } = req.params; // Destructure the system ID from URL parameters
      const deletedSystem = await System.findByIdAndDelete(systemId); // Delete the system

      if (!deletedSystem) {
        return res.status(404).json({ error: "System not found" });
      }

      res.status(200).json({ message: "System deleted" });
    } catch (error) {
      res.status(500).json({ error: "Error deleting system" });
    }
  }
);

export default router;
