// src/routes/api.ts

import { Router, Request, Response } from "express";
import Organization from "../models/Organization";
import System from "../models/System";

const router = Router();

// Route to create a new organization
router.post("/organizations", async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
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

      const organization = await Organization.findById(orgId);
      if (!organization)
        return res.status(404).json({ error: "Organization not found" });

      const newSystem = new System({ type, details, organization: orgId });
      await newSystem.save();

      organization.systems.push(newSystem._id);
      await organization.save();

      res.status(201).json(newSystem);
    } catch (error) {
      res.status(500).json({ error: "Error adding system" });
    }
  }
);

// Route to get all systems for a specific organization
router.get(
  "/organizations/:orgId/systems",
  async (req: Request, res: Response) => {
    try {
      const { orgId } = req.params;
      const systems = await System.find({ organization: orgId });
      res.status(200).json(systems);
    } catch (error) {
      res.status(500).json({ error: "Error fetching systems" });
    }
  }
);

// Route to fetch emissions and recommendations for a system
router.get("/systems/:systemId/data", async (req: Request, res: Response) => {
  try {
    const { systemId } = req.params;
    const system = await System.findById(systemId);
    if (!system) return res.status(404).json({ error: "System not found" });

    // Simulate external data fetching for emissions and recommendations
    const data = {
      emissions: `${Math.floor(Math.random() * 100)} tons of CO2`,
      efficiency: `${Math.floor(Math.random() * 100)}% efficiency`,
      recommendations: `Optimize the use of ${system.type} to reduce emissions.`,
    };

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching data" });
  }
});

export default router;
