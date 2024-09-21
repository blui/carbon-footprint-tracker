// src/middleware/auth.ts

import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// Extend the Request interface to include the user property (added dynamically in the middleware)
interface AuthenticatedRequest extends Request {
  user?: string | object; // The user property can be a string or an object, depending on how JWT is decoded
}

// Middleware to authenticate user based on JWT token
const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("x-auth-token"); // Retrieve the token from the request header

  // Check if no token was provided
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    // Verify the token using the secret key and assign the decoded payload to req.user
    const decoded = jwt.verify(token, "your_jwt_secret");
    req.user = decoded; // Attach the decoded payload (user info) to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    // If token verification fails, send an invalid token response
    res.status(400).send("Invalid token.");
  }
};

export default authenticate;
