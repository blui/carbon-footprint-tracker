// src/middleware/auth.ts

import jwt from "jsonwebtoken"; // Import JSON Web Token library for token verification
import { Request, Response, NextFunction } from "express"; // Import types for Request, Response, and NextFunction

// Extend the Request interface to include a user property (added dynamically in the middleware)
interface AuthenticatedRequest extends Request {
  user?: string | object; // The 'user' property can be a string or object, depending on how JWT is decoded
}

// Middleware to authenticate the user based on the JWT token provided in the request
const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("x-auth-token"); // Retrieve the token from the request headers

  // If no token is provided, return a 401 status code (Unauthorized)
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    // Verify the token using a secret key ('your_jwt_secret') and decode it
    const decoded = jwt.verify(token, "your_jwt_secret"); // Replace with actual secret key in production
    req.user = decoded; // Attach the decoded token payload (user information) to the request object
    next(); // Call the next middleware or route handler
  } catch (error) {
    // If token verification fails, send a 400 status code (Bad Request)
    res.status(400).send("Invalid token.");
  }
};

export default authenticate; // Export the middleware for use in other parts of the application
