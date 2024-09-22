// client/src/index.tsx

import React from "react"; // Import the React library to create components
import ReactDOM from "react-dom"; // Import ReactDOM to render components into the DOM
import App from "./App"; // Import the main App component, which serves as the root of the application
import "./index.css"; // Import the global CSS styles (which include Tailwind styles)

ReactDOM.render(
  <React.StrictMode>
    {/* StrictMode is a tool that highlights potential problems in an application, helping with best practices during development */}
    <App /> {/* Render the main App component inside the root element */}
  </React.StrictMode>,
  document.getElementById("root") // Target the 'root' element in the index.html file to mount the React app
);
