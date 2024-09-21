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
    fetchSystems(selectedOrgId); // Fetch systems for the selected organization
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Application Header */}
      <header className="bg-blue-600 text-white text-center py-6 shadow-lg">
        <h1 className="text-3xl font-bold">DataBridge Log Analyzer</h1>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-72 bg-gray-800 text-white p-6 h-screen">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Organizations
          </h2>
          <OrganizationList
            organizations={organizations}
            onSelect={handleSelectOrganization}
          />
          <div className="mt-8">
            <OrganizationForm
              onOrganizationCreated={handleOrganizationCreated}
            />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow p-10 bg-white shadow-lg">
          {selectedOrg ? (
            <>
              <h2 className="text-2xl font-semibold text-gray-700 border-b-2 border-blue-600 pb-2">
                {selectedOrg}
              </h2>
              {/* Pass orgId to SystemForm instead of organizations */}
              <SystemForm orgId={orgId!} onSystemAdded={handleSystemAdded} />
              {systems.length > 0 ? (
                <ul className="mt-6">
                  {systems.map((system) => (
                    <li
                      key={system._id}
                      className="py-4 border-b border-gray-300"
                    >
                      <strong className="font-semibold">{system.type}</strong>:{" "}
                      {system.details}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 mt-4">
                  No systems available for this organization.
                </p>
              )}
            </>
          ) : (
            <p className="text-gray-500">
              Please select an organization from the sidebar.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
