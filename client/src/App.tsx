// client/src/App.tsx

import React, { useState, useEffect } from "react";
import OrganizationForm from "./components/OrganizationForm";
import SystemForm from "./components/SystemForm";
import OrganizationList from "./components/OrganizationList"; // Import the organization list component
import API_BASE_URL from "./config";

const App: React.FC = () => {
  const [orgId, setOrgId] = useState<string | null>(null); // Selected organization ID
  const [systems, setSystems] = useState<any[]>([]); // List of systems for the selected organization
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null); // Selected organization name

  // Function to fetch systems for a specific organization
  const fetchSystems = (orgId: string) => {
    fetch(`${API_BASE_URL}/api/organizations/${orgId}/systems`)
      .then((res) => res.json())
      .then((data) => setSystems(data)) // Store the systems in state
      .catch((err) => console.error("Error fetching systems:", err)); // Handle errors
  };

  // useEffect hook to fetch systems when an organization is selected
  useEffect(() => {
    if (orgId) {
      fetchSystems(orgId); // Fetch systems when orgId changes
    }
  }, [orgId]); // Dependency array ensures this runs only when orgId changes

  // Handle organization creation
  const handleOrganizationCreated = (
    createdOrgId: string,
    createdOrgName: string
  ) => {
    setOrgId(createdOrgId); // Set the selected organization ID
    setSelectedOrg(createdOrgName); // Set the selected organization name
    setSystems([]); // Reset systems list for the new organization
  };

  // Handle system addition
  const handleSystemAdded = () => {
    if (orgId) {
      fetchSystems(orgId); // Refresh systems after a new one is added
    }
  };

  return (
    <div>
      <h1>Carbon Footprint Tracker</h1>

      {/* Form to create an organization */}
      <OrganizationForm onOrganizationCreated={handleOrganizationCreated} />

      {/* Conditionally render the system form if an organization is selected */}
      {orgId && (
        <div>
          <h2>Add a System to {selectedOrg}</h2>
          <SystemForm orgId={orgId} onSystemAdded={handleSystemAdded} />
        </div>
      )}

      {/* Conditionally render the list of systems if any exist for the selected organization */}
      {systems.length > 0 && (
        <div>
          <h2>Systems for {selectedOrg}</h2>
          <ul>
            {systems.map((system) => (
              <li key={system._id}>
                {system.type}: {system.details}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Render all organizations and their systems */}
      <OrganizationList />
    </div>
  );
};

export default App;
