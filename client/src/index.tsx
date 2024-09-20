// client/src/index.tsx

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css"; // Optional: Importing styles

// Rendering the root App component
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
