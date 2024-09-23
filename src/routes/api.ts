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
      const { orgId } = req.params;
      const { type, name, workflow, classification, year, make, model } =
        req.body;

      // Find the organization by ID
      const organization = await Organization.findById(orgId);
      if (!organization) {
        return res.status(404).json({ error: "Organization not found" });
      }

      // Initialize systemData object with common fields
      let systemData: Record<string, any> = { type, organization: orgId };

      // Handle system type and its specific fields
      if (type === "workflowSystem") {
        // Check that 'name' and 'workflow' are provided for workflow systems
        if (!name || !workflow) {
          return res.status(400).json({
            error: "Invalid or missing workflow data",
          });
        }
        systemData.workflowSystem = { name, workflow }; // Expecting workflow as a string
      } else if (type === "vendorSystem") {
        // Validate 'name' and 'classification' for vendor systems
        if (!name || !classification) {
          return res.status(400).json({
            error: "Invalid or missing vendor system data",
          });
        }
        systemData.vendorSystem = { name, classification };
      } else if (type === "vehicleSystem") {
        // Validate vehicle details (year, make, model)
        if (!year || !make || !model) {
          return res.status(400).json({
            error: "Invalid or missing vehicle details",
          });
        }
        systemData.vehicleSystem = { year, make, model };
      } else {
        return res.status(400).json({ error: "Invalid system type" });
      }

      // Create and save the new system
      const newSystem = new System(systemData);
      await newSystem.save();

      // Add the new system to the organization
      organization.systems.push(newSystem._id);
      await organization.save();

      res.status(201).json(newSystem);
    } catch (error: any) {
      // Log the error for debugging
      console.error("Error adding system:", error);
      res
        .status(500)
        .json({ error: "Error adding system", details: error.message });
    }
  }
);

// Route to fetch all systems for a given organization
router.get(
  "/organizations/:orgId/systems",
  async (req: Request, res: Response) => {
    try {
      const { orgId } = req.params;

      // Fetch systems for the organization
      const systems = await System.find({ organization: orgId }).lean(); // Use lean() for better performance

      // Process systems to ensure proper structure
      const processedSystems = systems.map((system) => {
        if (system.type === "workflowSystem") {
          return {
            _id: system._id,
            type: system.type,
            workflowSystem: {
              name: system.workflowSystem?.name || "N/A",
              workflow: system.workflowSystem?.workflow || "No workflow items",
            },
          };
        } else if (system.type === "vendorSystem") {
          return {
            _id: system._id,
            type: system.type,
            vendorSystem: {
              name: system.vendorSystem?.name || "N/A",
              classification: system.vendorSystem?.classification || "N/A",
            },
          };
        } else if (system.type === "vehicleSystem") {
          return {
            _id: system._id,
            type: system.type,
            vehicleSystem: {
              year: system.vehicleSystem?.year || "N/A",
              make: system.vehicleSystem?.make || "N/A",
              model: system.vehicleSystem?.model || "N/A",
            },
          };
        } else {
          return system; // Return unchanged for unexpected types
        }
      });

      // Log the processed systems to verify
      console.log("Processed systems:", processedSystems);

      res.status(200).json(processedSystems);
    } catch (error: any) {
      console.error("Error fetching systems:", error.message);
      res.status(500).json({ error: "Error fetching systems" });
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
