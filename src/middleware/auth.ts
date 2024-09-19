// src/middleware/auth.ts

// Importing jsonwebtoken (JWT) library to handle token verification
import jwt from "jsonwebtoken";

// Middleware function to authenticate users based on a JWT token
const authenticate = (req: any, res: any, next: any) => {
  // Extracting the token from the request header "x-auth-token"
  const token = req.header("x-auth-token");

  // If the token is not provided, return a 401 (Unauthorized) response
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    // Verify the token using the secret key ("your_jwt_secret")
    const decoded = jwt.verify(token, "your_jwt_secret");

    // Attach the decoded token (usually user info) to the request object
    req.user = decoded;

    // Call the next middleware or route handler
    next();
  } catch (ex) {
    // If token verification fails, return a 400 (Bad Request) response
    res.status(400).send("Invalid token.");
  }
};

// Export the middleware function to be used in other parts of the app
export default authenticate;
