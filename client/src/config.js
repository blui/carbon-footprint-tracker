// client/src/config.js

// Use environment variables or set API base URLs depending on the environment
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://your-production-api-url.com" // Production API URL
    : "http://localhost:3000"; // Local development API URL

export default API_BASE_URL;
