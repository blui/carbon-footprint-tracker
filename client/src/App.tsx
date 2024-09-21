// client/src/App.tsx

import React, { useState, useEffect } from "react";
import OrganizationForm from "./components/OrganizationForm";
import SystemForm from "./components/SystemForm";
import OrganizationList from "./components/OrganizationList";
import API_BASE_URL from "./config";

const App: React.FC = () => {
  const [orgId, setOrgId] = useState<string | null>(null); // Track selected organization ID
  const [organizations, setOrganizations] = useState<any[]>([]); // List of organizations
  const [systems, setSystems] = useState<any[]>([]); // List of systems for the selected organization
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null); // Track selected organization name

  // Fetch all organizations from the backend
  const fetchOrganizations = () => {
    fetch(`${API_BASE_URL}/api/organizations`)
      .then((res) => res.json())
      .then((data) => setOrganizations(data))
      .catch((err) => console.error("Error fetching organizations:", err));
  };

  // Fetch systems for a specific organization
  const fetchSystems = (orgId: string) => {
    fetch(`${API_BASE_URL}/api/organizations/${orgId}/systems`)
      .then((res) => res.json())
      .then((data) => setSystems(data))
      .catch((err) => console.error("Error fetching systems:", err));
  };

  // Fetch organizations on mount
  useEffect(() => {
    fetchOrganizations();
  }, []);

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
    setSystems([]);
    fetchOrganizations();
  };

  // Handle system addition
  const handleSystemAdded = () => {
    fetchOrganizations();
    if (orgId) {
      fetchSystems(orgId);
    }
  };

  // Handle selecting an organization from the sidebar
  const handleSelectOrganization = (
    selectedOrgId: string,
    selectedOrgName: string
  ) => {
    setOrgId(selectedOrgId);
    setSelectedOrg(selectedOrgName);
    fetchSystems(selectedOrgId);
  };

  return (
    <>
      {/* Application Header (Full width) */}
      <header className="app-header">
        <h1>DataBridge Log Analyzer</h1> {/* Name of the application */}
      </header>

      <div className="app-container">
        {/* Left-side Navigation Pane */}
        <div className="sidebar">
          <h2 className="sidebar-title">Organizations</h2>
          <OrganizationList
            organizations={organizations}
            onSelect={handleSelectOrganization}
          />
          <div style={{ marginTop: "20px" }}>
            <OrganizationForm
              onOrganizationCreated={handleOrganizationCreated}
            />
          </div>
        </div>

        {/* Main content area */}
        <div className="main-content">
          {selectedOrg ? (
            <>
              <h2 className="org-title">{selectedOrg}</h2>
              <SystemForm
                organizations={organizations}
                onSystemAdded={handleSystemAdded}
              />
              {systems.length > 0 ? (
                <ul className="system-list">
                  {systems.map((system) => (
                    <li key={system._id} className="system-item">
                      <strong>{system.type}</strong>: {system.details}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No systems available for this organization.</p>
              )}
            </>
          ) : (
            <p>Please select an organization from the sidebar.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default App;
