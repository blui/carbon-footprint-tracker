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
    if (!updatedOrg) {
      return res.status(404).json({ error: "Organization not found" });
    }
    res.status(200).json(updatedOrg); // Respond with the updated organization data
  } catch (error) {
    res.status(500).json({ error: "Error updating organization" });
  }
});

// Route to delete an organization and its associated systems
router.delete("/organizations/:orgId", async (req: Request, res: Response) => {
  try {
    const { orgId } = req.params;
    console.log("Deleting organization with ID:", orgId); // Add this log
    const deletedOrg = await Organization.findByIdAndDelete(orgId);
    if (!deletedOrg) {
      return res.status(404).json({ error: "Organization not found" });
    }
    await System.deleteMany({ organization: orgId }); // Delete all systems
    res
      .status(200)
      .json({ message: "Organization and related systems deleted" });
  } catch (error) {
    console.error("Error deleting organization:", error);
    res.status(500).json({ error: "Error deleting organization" });
  }
});

// Route to add a system to an organization
router.post(
  "/organizations/:orgId/systems",
  async (req: Request, res: Response) => {
    try {
      const { orgId } = req.params;
      const {
        type,
        name,
        workflow,
        classification,
        year,
        make,
        model,
        emissions,
        efficiency,
        recommendations,
      } = req.body;

      // Find the organization by ID
      const organization = await Organization.findById(orgId);
      if (!organization) {
        return res.status(404).json({ error: "Organization not found" });
      }

      // Initialize systemData object with common fields
      let systemData: Record<string, any> = {
        type,
        organization: orgId,
        emissions: emissions || null, // Add emissions field
        efficiency: efficiency || null, // Add efficiency field
        recommendations: recommendations || null, // Add recommendations field
      };

      // Handle system type and its specific fields
      if (type === "workflowSystem") {
        if (!name || !workflow) {
          return res.status(400).json({
            error: "Invalid or missing workflow data",
          });
        }
        systemData.workflowSystem = { name, workflow };
      } else if (type === "vendorSystem") {
        if (!name || !classification) {
          return res.status(400).json({
            error: "Invalid or missing vendor system data",
          });
        }
        systemData.vendorSystem = { name, classification };
      } else if (type === "vehicleSystem") {
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
      console.error("Error adding system:", error);
      res
        .status(500)
        .json({ error: "Error adding system", details: error.message });
    }
  }
);

// Route to fetch all systems for a given organization, including emissions and efficiency
router.get(
  "/organizations/:orgId/systems",
  async (req: Request, res: Response) => {
    try {
      const { orgId } = req.params;

      // Fetch systems for the organization
      const systems = await System.find({ organization: orgId }).lean();

      // Process systems to ensure proper structure
      const processedSystems = systems.map((system) => {
        // Safely extract emissions and its fields if it exists
        const emissionsData = system.emissions ?? {};
        const emissions = emissionsData.co2 ?? "N/A";
        const efficiency = emissionsData.efficiency ?? "N/A";
        const recommendations = emissionsData.recommendations ?? "N/A";

        // Base structure with common fields
        const baseSystem = {
          _id: system._id,
          type: system.type,
          emissions,
          efficiency,
          recommendations,
        };

        // Handle the specific fields based on system type
        if (system.type === "workflowSystem") {
          return {
            ...baseSystem,
            workflowSystem: {
              name: system.workflowSystem?.name || "N/A",
              workflow: system.workflowSystem?.workflow || "No workflow items",
            },
          };
        } else if (system.type === "vendorSystem") {
          return {
            ...baseSystem,
            vendorSystem: {
              name: system.vendorSystem?.name || "N/A",
              classification: system.vendorSystem?.classification || "N/A",
            },
          };
        } else if (system.type === "vehicleSystem") {
          return {
            ...baseSystem,
            vehicleSystem: {
              year: system.vehicleSystem?.year || "N/A",
              make: system.vehicleSystem?.make || "N/A",
              model: system.vehicleSystem?.model || "N/A",
            },
          };
        } else {
          return baseSystem; // Return unchanged for unexpected types
        }
      });

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
      const { systemId } = req.params;
      const {
        type,
        name,
        workflow,
        classification,
        year,
        make,
        model,
        emissions,
        efficiency,
        recommendations,
      } = req.body;

      let systemData: any = {
        emissions, // Include emissions update
        efficiency, // Include efficiency update
        recommendations, // Include recommendations update
      };

      // Handle the system type and map it to the appropriate fields
      if (type === "workflowSystem") {
        if (!name || !workflow) {
          return res.status(400).json({
            error: "Name and workflow are required for workflowSystem",
          });
        }
        systemData.type = type;
        systemData.workflowSystem = { name, workflow };
      } else if (type === "vendorSystem") {
        if (!name || !classification) {
          return res.status(400).json({
            error: "Name and classification are required for vendorSystem",
          });
        }
        systemData.type = type;
        systemData.vendorSystem = { name, classification };
      } else if (type === "vehicleSystem") {
        if (!year || !make || !model) {
          return res.status(400).json({
            error: "Year, make, and model are required for vehicleSystem",
          });
        }
        systemData.type = type;
        systemData.vehicleSystem = { year, make, model };
      } else {
        return res.status(400).json({ error: "Invalid system type" });
      }

      // Update the system
      const updatedSystem = await System.findByIdAndUpdate(
        systemId,
        systemData,
        { new: true }
      );

      if (!updatedSystem) {
        return res.status(404).json({ error: "System not found" });
      }

      res.status(200).json(updatedSystem);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res
          .status(500)
          .json({ error: "Error updating system", details: error.message });
      } else {
        res.status(500).json({
          error: "Error updating system",
          details: "Unknown error occurred",
        });
      }
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
