import React, { useState, useEffect } from "react";
import OrganizationForm from "./components/OrganizationForm";
import SystemForm from "./components/SystemForm";
import SystemTable from "./components/SystemTable"; // Import SystemTable component
import API_BASE_URL from "./config";

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

  // Handle updating an organization
  const handleUpdateOrganization = async (orgId: string) => {
    const updatedName = prompt("Enter new organization name:");
    if (updatedName) {
      await fetch(`${API_BASE_URL}/api/organizations/${orgId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: updatedName }),
      });
      fetchOrganizations(); // Refresh the organization list after update
    }
  };

  // Handle deleting an organization
  const handleDeleteOrganization = async (orgId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this organization? This will delete all associated systems as well."
      )
    ) {
      await fetch(`${API_BASE_URL}/api/organizations/${orgId}`, {
        method: "DELETE",
      });
      fetchOrganizations(); // Refresh the organization list after deletion
      setOrgId(null); // Clear selected organization after deletion
      setSelectedOrgName(null); // Clear selected organization name after deletion
      setSystems([]); // Clear systems list after organization is deleted
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Application Header */}
      <header className="bg-blue-600 text-white text-center py-6 shadow-lg">
        <h1 className="text-3xl font-bold">Carbon Footprint Tracker</h1>
      </header>

      <div className="flex">
        {/* Sidebar for Organizations */}
        <div className="w-72 bg-gray-800 text-white p-6 h-screen">
          <h2 className="text-xl font-semibold mb-6">Your Organizations</h2>

          {/* Pass handlers for selecting, updating, and deleting organizations */}
          <ul>
            {organizations.map((org) => (
              <li
                key={org._id}
                onClick={() => handleSelectOrganization(org._id, org.name)}
                className={`cursor-pointer py-2 px-4 bg-gray-700 rounded-lg mb-2 ${
                  org._id === orgId
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 text-gray-300"
                }`} // Highlight the selected organization
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
              {/* Title Above Left and Right Sections */}
              <h2 className="text-3xl font-semibold text-center mb-8">
                {selectedOrgName} Overview
              </h2>

              {/* Grid for Left (Stats) and Right (System Form) */}
              <div className="grid grid-cols-2 gap-8">
                {/* Left Side: Organization Statistics */}
                <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                  <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                    {selectedOrgName} Statistics
                  </h3>
                  <ul className="space-y-4">
                    <li className="text-lg font-medium text-gray-600">
                      Emissions:{" "}
                      <span className="text-gray-800">1,500 kg CO₂</span>
                    </li>
                    <li className="text-lg font-medium text-gray-600">
                      Efficiency: <span className="text-gray-800">85%</span>
                    </li>
                    <li className="text-lg font-medium text-gray-600">
                      Setup Grade: <span className="text-gray-800">B+</span>
                    </li>
                  </ul>
                </div>

                {/* Right Side: System Form */}
                <div>
                  <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                    Add System to {selectedOrgName}
                  </h3>
                  <SystemForm
                    orgId={orgId!}
                    onSystemAdded={() => fetchSystems(orgId!)}
                  />
                </div>
              </div>

              {/* Bottom Section: System Table */}
              <div className="mt-10">
                <h3 className="text-xl font-semibold mb-4">Systems</h3>
                {systems.length > 0 ? (
                  <SystemTable
                    systems={systems}
                    orgId={orgId!}
                    onSystemUpdated={() => fetchSystems(orgId!)}
                  />
                ) : (
                  <p className="text-gray-500">
                    No systems available for this organization.
                  </p>
                )}
              </div>
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
