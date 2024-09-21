// client/src/App.tsx

import React, { useEffect, useState } from "react";
import OrganizationForm from "./components/OrganizationForm";
import SystemForm from "./components/SystemForm";
import SystemData from "./components/SystemData";
import API_BASE_URL from "./config";

const App = () => {
  const [orgId, setOrgId] = useState<string | null>(null); // Store the selected organization ID
  const [systemId, setSystemId] = useState<string | null>(null); // Store the selected system ID
  const [systems, setSystems] = useState<any[]>([]); // Store the list of systems for an organization

  // Fetch systems for the selected organization
  useEffect(() => {
    if (orgId) {
      fetch(`${API_BASE_URL}/api/organizations/${orgId}/systems`)
        .then((res) => res.json())
        .then((data) => {
          setSystems(data); // Store the systems
        })
        .catch((err) => console.error("Error fetching systems:", err));
    }
  }, [orgId]);

  return (
    <div>
      <h1>Carbon Footprint Tracker</h1>

      {/* Form to create an organization */}
      <OrganizationForm />

      {/* Form to add a system to the organization (pass orgId to SystemForm) */}
      {orgId && <SystemForm orgId={orgId} />}

      {/* Dropdown to select system and show data */}
      {systems.length > 0 && (
        <div>
          <h2>Select a System</h2>
          <select onChange={(e) => setSystemId(e.target.value)} defaultValue="">
            <option value="" disabled>
              Select a system
            </option>
            {systems.map((system) => (
              <option key={system._id} value={system._id}>
                {system.type} - {system.details}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Show system data once a system is selected */}
      {systemId && <SystemData systemId={systemId} />}
    </div>
  );
};

export default App;
