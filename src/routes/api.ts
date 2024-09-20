// src/routes/api.ts

import { Router, Request, Response } from "express";
import Organization from "../models/Organization";
import System from "../models/System";

const router = Router();

// Route to create a new organization
router.post("/organizations", async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    // Create and save a new organization
    const newOrg = new Organization({ name });
    await newOrg.save();

    res.status(201).json(newOrg);
  } catch (error) {
    res.status(500).json({ error: "Error creating organization" });
  }
});

// Route to add a system to an organization
router.post(
  "/organizations/:orgId/systems",
  async (req: Request, res: Response) => {
    try {
      const { orgId } = req.params;
      const { type, details } = req.body;

      // Find the organization by ID
      const organization = await Organization.findById(orgId);
      if (!organization)
        return res.status(404).json({ error: "Organization not found" });

      // Create and save a new system
      const newSystem = new System({ type, details, organization: orgId });
      await newSystem.save();

      // Add the system to the organization
      organization.systems.push(newSystem._id);
      await organization.save();

      res.status(201).json(newSystem);
    } catch (error) {
      res.status(500).json({ error: "Error adding system" });
    }
  }
);

// Mock external data fetching for emissions and recommendations
async function fetchExternalData(systemType: string) {
  const mockData = {
    emissions: `${Math.floor(Math.random() * 100)} tons of CO2`,
    efficiency: `${Math.floor(Math.random() * 100)}% efficiency`,
    recommendations: `Optimize the use of ${systemType} to reduce emissions by 20%.`,
  };
  return mockData;
}

// Route to fetch emissions and recommendations data
router.get("/systems/:systemId/data", async (req: Request, res: Response) => {
  try {
    const { systemId } = req.params;

    // Find the system by ID
    const system = await System.findById(systemId);
    if (!system) return res.status(404).json({ error: "System not found" });

    // Fetch mock data for emissions and recommendations
    const data = await fetchExternalData(system.type);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching data" });
  }
});

export default router;
