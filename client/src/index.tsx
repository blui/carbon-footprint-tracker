// client/src/index.tsx

import React from "react"; // Import the core React library
import ReactDOM from "react-dom"; // Import ReactDOM for rendering components
import App from "./App"; // Import the main App component
import "./index.css"; // Import the global styles

// Render the App component inside the root div in the HTML
ReactDOM.render(
  <React.StrictMode>
    {/* StrictMode helps identify potential issues during development */}
    <App />
  </React.StrictMode>,
  document.getElementById("root") // Target the root element in the index.html file
);
