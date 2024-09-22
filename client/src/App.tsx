// client/src/App.tsx

import React, { useState, useEffect } from "react"; // Import React and necessary hooks
import OrganizationForm from "./components/OrganizationForm"; // Import OrganizationForm component
import SystemForm from "./components/SystemForm"; // Import SystemForm component
import OrganizationList from "./components/OrganizationList"; // Import OrganizationList component
import API_BASE_URL from "./config"; // Import the base API URL

const App: React.FC = () => {
  const [orgId, setOrgId] = useState<string | null>(null); // State to track the selected organization's ID
  const [organizations, setOrganizations] = useState<any[]>([]); // State to store a list of organizations
  const [systems, setSystems] = useState<any[]>([]); // State to store systems for the selected organization
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null); // State to track the selected organization's name

  // Function to fetch all organizations from the backend
  const fetchOrganizations = () => {
    fetch(`${API_BASE_URL}/api/organizations`)
      .then((res) => res.json()) // Parse the JSON response
      .then((data) => setOrganizations(data)) // Update the organizations state with fetched data
      .catch((err) => console.error("Error fetching organizations:", err)); // Log errors, if any
  };

  // Function to fetch all systems for a specific organization
  const fetchSystems = (orgId: string) => {
    fetch(`${API_BASE_URL}/api/organizations/${orgId}/systems`)
      .then((res) => res.json()) // Parse the JSON response
      .then((data) => setSystems(data)) // Update the systems state with fetched data
      .catch((err) => console.error("Error fetching systems:", err)); // Log errors, if any
  };

  // Fetch all organizations when the component mounts
  useEffect(() => {
    fetchOrganizations();
  }, []);

  // Fetch systems for the selected organization when the orgId changes
  useEffect(() => {
    if (orgId) {
      fetchSystems(orgId);
    }
  }, [orgId]);

  // Handle the creation of a new organization
  const handleOrganizationCreated = (
    createdOrgId: string,
    createdOrgName: string
  ) => {
    setOrgId(createdOrgId); // Set the newly created organization's ID
    setSelectedOrg(createdOrgName); // Set the newly created organization's name
    setSystems([]); // Clear the systems list
    fetchOrganizations(); // Refresh the list of organizations
  };

  // Handle the addition of a new system
  const handleSystemAdded = () => {
    fetchOrganizations(); // Refresh the list of organizations
    if (orgId) {
      fetchSystems(orgId); // Refresh the systems for the current organization
    }
  };

  // Handle selecting an organization from the sidebar
  const handleSelectOrganization = (
    selectedOrgId: string,
    selectedOrgName: string
  ) => {
    setOrgId(selectedOrgId); // Set the selected organization's ID
    setSelectedOrg(selectedOrgName); // Set the selected organization's name
    fetchSystems(selectedOrgId); // Fetch systems for the selected organization
  };

  // Handle updating an organization's name
  const handleUpdateOrganization = async (orgId: string) => {
    const updatedName = prompt("Enter new organization name:"); // Prompt user for a new organization name
    if (updatedName) {
      await fetch(`${API_BASE_URL}/api/organizations/${orgId}`, {
        method: "PUT", // Send a PUT request to update the organization
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: updatedName }), // Send the updated name in the request body
      });
      fetchOrganizations(); // Refresh the list of organizations
    }
  };

  // Handle deleting an organization
  const handleDeleteOrganization = async (orgId: string) => {
    if (window.confirm("Are you sure you want to delete this organization?")) {
      await fetch(`${API_BASE_URL}/api/organizations/${orgId}`, {
        method: "DELETE", // Send a DELETE request to delete the organization
      });
      fetchOrganizations(); // Refresh the list of organizations
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Application Header */}
      <header className="bg-blue-600 text-white text-center py-6 shadow-lg">
        <h1 className="text-3xl font-bold">Carbon Footprint Tracker</h1>
      </header>

      <div className="flex">
        {/* Sidebar for Organization List */}
        <div className="w-72 bg-gray-800 text-white p-6 h-screen">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Your Organizations
          </h2>
          <OrganizationList
            organizations={organizations} // Pass the list of organizations to the OrganizationList component
            onSelect={handleSelectOrganization} // Pass the select handler
            onUpdate={handleUpdateOrganization} // Pass the update handler
            onDelete={handleDeleteOrganization} // Pass the delete handler
          />
          <div className="mt-8">
            <OrganizationForm
              onOrganizationCreated={handleOrganizationCreated}
            />
          </div>
        </div>

        {/* Main Content Area for Organization Details and System Form */}
        <div className="flex-grow p-10 bg-white shadow-lg">
          {selectedOrg ? (
            <>
              <h2 className="text-2xl font-semibold text-gray-700 border-b-2 border-blue-600 pb-2">
                {selectedOrg}
              </h2>
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
