// client/src/index.tsx

import React from "react";
import ReactDOM from "react-dom/client"; // Import the new createRoot API from ReactDOM
import App from "./App";
import "./index.css";

// Create a root for rendering the React application
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

// Render the App component inside the root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
