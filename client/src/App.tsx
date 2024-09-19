// Importing React for building the component
import React from "react";

// Importing the Dashboard component
import Dashboard from "./components/Dashboard";

// The App component is the main entry point of the application.
// It renders the Dashboard component as its child.
const App: React.FC = () => {
  return (
    <div>
      {/* Rendering the Dashboard component */}
      <Dashboard />
    </div>
  );
};

// Exporting the App component to be rendered by the root file (index.tsx)
export default App;
