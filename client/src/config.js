// config.js

// Detect if the app is running in production or development mode
// Use environment variables or fallback to local development API URL
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || // Use environment-specific API URL if set
  (process.env.NODE_ENV === "production"
    ? "https://your-production-api-url.com" // Production API URL
    : "http://localhost:3000"); // Local development API URL

export default API_BASE_URL;
