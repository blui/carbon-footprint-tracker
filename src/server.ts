// src/server.ts

import express, { Request, Response } from "express";
import apiRoutes from "./routes/api";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // To handle JSON payloads
app.use("/api", apiRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Carbon Footprint Tracker API is up and running!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
