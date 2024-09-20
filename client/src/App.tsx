// client/src/App.tsx

import React from "react";
import OrganizationForm from "./components/OrganizationForm";
import SystemForm from "./components/SystemForm";
import SystemData from "./components/SystemData";

const App = () => {
  const orgId = "12345"; // Example organization ID for testing

  return (
    <div>
      <h1>Carbon Footprint Tracker</h1>
      {/* Form to create an organization */}
      <OrganizationForm />

      {/* Form to add a system */}
      <SystemForm orgId={orgId} />

      {/* Display emissions and recommendations */}
      <SystemData systemId="system123" />
    </div>
  );
};

export default App;
