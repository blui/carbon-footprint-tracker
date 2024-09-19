// src/routes/api.ts

import { Router, Request, Response } from "express";
const router = Router();

router.get("/emissions", (req: Request, res: Response) => {
  // Return emissions data here
  res.json({ message: "Get Carbon Emissions" });
});

router.post("/emissions", (req: Request, res: Response) => {
  // Post emissions data here
  res.json({ message: "Post Carbon Emissions" });
});

export default router;
