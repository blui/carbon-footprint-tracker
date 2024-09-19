// Importing React for building the component
import React from "react";

// The Dashboard component is a simple functional component that
// displays the title and description of the carbon footprint tracker app.
const Dashboard: React.FC = () => {
  return (
    <div>
      {/* Title of the dashboard */}
      <h1>Carbon Footprint Tracker</h1>

      {/* Description explaining the purpose of the application */}
      <p>Track your emissions and optimize supply chain solutions.</p>
    </div>
  );
};

// Exporting the Dashboard component to be used in other parts of the app
export default Dashboard;
