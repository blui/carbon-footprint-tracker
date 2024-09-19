// src/middleware/auth.ts

import jwt from "jsonwebtoken";

const authenticate = (req: any, res: any, next: any) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const decoded = jwt.verify(token, "your_jwt_secret");
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
};

export default authenticate;
