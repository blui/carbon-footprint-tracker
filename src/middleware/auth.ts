// src/middleware/auth.ts

import jwt from "jsonwebtoken"; // Import the JSON Web Token (JWT) library
import { Request, Response, NextFunction } from "express"; // Import types for Request, Response, and NextFunction

// Define an interface to extend the Request object with a 'user' property
interface AuthenticatedRequest extends Request {
  user?: string | object; // The 'user' property can be a string or an object, based on JWT payload
}

// Middleware function to authenticate requests based on a JWT token
const authenticate = (
  req: AuthenticatedRequest, // Request object, extended with 'user'
  res: Response, // Response object
  next: NextFunction // Next middleware function
) => {
  const token = req.header("x-auth-token"); // Retrieve the JWT token from the 'x-auth-token' request header

  // If no token is found, deny access with a 401 Unauthorized status
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    // Verify the token using the secret key ('your_jwt_secret')
    const decoded = jwt.verify(token, "your_jwt_secret"); // Decode the JWT; replace 'your_jwt_secret' with the actual secret key
    req.user = decoded; // Attach the decoded payload (usually user info) to the request object
    next(); // Pass control to the next middleware or route handler
  } catch (error) {
    // If token verification fails, respond with a 400 Bad Request status
    res.status(400).send("Invalid token.");
  }
};

export default authenticate; // Export the middleware function for use in other parts of the app
