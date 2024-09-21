import React, { useState, useEffect } from "react";
import OrganizationForm from "./components/OrganizationForm";
import SystemForm from "./components/SystemForm";
import API_BASE_URL from "./config";

const App = () => {
  const [orgId, setOrgId] = useState<string | null>(null); // Selected organization ID
  const [systems, setSystems] = useState<any[]>([]); // List of systems for the organization
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null); // Track selected organization name for display

  // Function to fetch systems for a specific organization
  const fetchSystems = (orgId: string) => {
    fetch(`${API_BASE_URL}/api/organizations/${orgId}/systems`)
      .then((res) => res.json())
      .then((data) => setSystems(data))
      .catch((err) => console.error("Error fetching systems:", err));
  };

  // Fetch systems when an organization is selected
  useEffect(() => {
    if (orgId) {
      fetchSystems(orgId);
    }
  }, [orgId]);

  // Handle organization creation
  const handleOrganizationCreated = (
    createdOrgId: string,
    createdOrgName: string
  ) => {
    setOrgId(createdOrgId);
    setSelectedOrg(createdOrgName);
  };

  return (
    <div>
      <h1>Carbon Footprint Tracker</h1>

      {/* Form to create an organization */}
      <OrganizationForm onOrganizationCreated={handleOrganizationCreated} />

      {/* Form to add a system to the organization */}
      {orgId && (
        <SystemForm orgId={orgId} onSystemAdded={() => fetchSystems(orgId)} />
      )}

      {/* Display list of systems for the organization */}
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
    </div>
  );
};

export default App;
