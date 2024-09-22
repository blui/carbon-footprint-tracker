import React, { useState, useEffect } from "react";
import OrganizationForm from "./components/OrganizationForm";
import SystemForm from "./components/SystemForm";
import SystemTable from "./components/SystemTable"; // Import SystemTable component
import API_BASE_URL from "./config"; // Import API base URL

const App = () => {
  const [orgId, setOrgId] = useState<string | null>(null); // Track selected organization ID
  const [systems, setSystems] = useState<any[]>([]); // List of systems for the selected organization
  const [organizations, setOrganizations] = useState<any[]>([]); // List of organizations
  const [selectedOrgName, setSelectedOrgName] = useState<string | null>(null); // Track the selected organization name

  // Function to fetch organizations from the backend
  const fetchOrganizations = () => {
    fetch(`${API_BASE_URL}/api/organizations`)
      .then((res) => res.json())
      .then((data) => setOrganizations(data))
      .catch((err) => console.error("Error fetching organizations:", err));
  };

  // Fetch systems for a selected organization
  const fetchSystems = (orgId: string) => {
    fetch(`${API_BASE_URL}/api/organizations/${orgId}/systems`)
      .then((res) => res.json())
      .then((data) => setSystems(data))
      .catch((err) => console.error("Error fetching systems:", err));
  };

  // Fetch organizations on initial render
  useEffect(() => {
    fetchOrganizations();
  }, []);

  // Handle selecting an organization
  const handleSelectOrganization = (
    selectedOrgId: string,
    selectedOrgName: string
  ) => {
    setOrgId(selectedOrgId);
    setSelectedOrgName(selectedOrgName); // Set the selected organization's name
    fetchSystems(selectedOrgId); // Fetch systems for the selected organization
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Application Header */}
      <header className="bg-blue-600 text-white text-center py-6 shadow-lg mb-6">
        <h1 className="text-3xl font-bold">Carbon Footprint Tracker</h1>
      </header>

      <div className="flex">
        {/* Sidebar for Organizations */}
        <div className="w-72 bg-gray-800 text-white p-6 h-screen">
          <h2 className="text-xl font-semibold mb-6">Your Organizations</h2>

          {/* List of organizations */}
          <ul className="space-y-2">
            {" "}
            {/* Adds vertical spacing between organization items */}
            {organizations.map((org) => (
              <li
                key={org._id}
                onClick={() => handleSelectOrganization(org._id, org.name)}
                className={`cursor-pointer py-2 px-4 bg-gray-700 rounded-lg ${
                  org._id === orgId
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                {org.name}
              </li>
            ))}
          </ul>

          {/* Form to add new organization */}
          <div className="mt-8">
            <OrganizationForm onOrganizationCreated={fetchOrganizations} />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow p-10 bg-white shadow-lg">
          {selectedOrgName ? (
            <>
              <h2 className="text-2xl font-semibold text-gray-700 mb-6">
                Systems for {selectedOrgName}
              </h2>

              <div className="flex mb-8">
                {/* Left Side: Statistics Section */}
                <div className="w-1/2 pr-4">
                  <h3 className="text-xl font-semibold mb-2">
                    Organization Statistics
                  </h3>
                  <div className="bg-gray-100 p-4 rounded-lg shadow-md space-y-4">
                    <p>
                      <strong>Calculated Emissions:</strong> 1200 kg CO2
                    </p>
                    <p>
                      <strong>System Efficiency:</strong> 85%
                    </p>
                    <p>
                      <strong>Organizational Grade:</strong> B+
                    </p>
                  </div>
                </div>

                {/* Right Side: System Form Section */}
                <div className="w-1/2">
                  <SystemForm
                    orgId={orgId!}
                    onSystemAdded={() => fetchSystems(orgId!)}
                  />
                </div>
              </div>

              {/* Systems Table displayed below both sections */}
              {systems.length > 0 ? (
                <div className="mt-8">
                  <SystemTable
                    systems={systems}
                    onDeleteSystem={(systemId) => {
                      fetch(
                        `${API_BASE_URL}/api/organizations/${orgId}/systems/${systemId}`,
                        {
                          method: "DELETE",
                        }
                      ).then(() => fetchSystems(orgId!)); // Refetch systems after deletion
                    }}
                    onEditSystem={(systemId) => {
                      const updatedDetails = prompt(
                        "Enter new system details:"
                      );
                      if (updatedDetails) {
                        fetch(
                          `${API_BASE_URL}/api/organizations/${orgId}/systems/${systemId}`,
                          {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ details: updatedDetails }),
                          }
                        ).then(() => fetchSystems(orgId!)); // Refetch systems after edit
                      }
                    }}
                  />
                </div>
              ) : (
                <p className="text-gray-500 mt-8">
                  No systems available for this organization.
                </p>
              )}
            </>
          ) : (
            <p className="text-gray-500">
              Please select an organization to view its systems.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
