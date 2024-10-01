import React, { useState, useEffect } from "react";
import OrganizationForm from "./components/OrganizationForm";
import OrganizationList from "./components/OrganizationList"; // Ensure you import this component
import SystemForm from "./components/SystemForm";
import SystemTable from "./components/SystemTable"; // Import SystemTable component
import API_BASE_URL from "./config"; // Import API base URL

const App = () => {
  const [orgId, setOrgId] = useState<string | null>(null); // Track selected organization ID
  const [systems, setSystems] = useState<any[]>([]); // List of systems for the selected organization
  const [organizations, setOrganizations] = useState<any[]>([]); // List of organizations
  const [selectedOrgName, setSelectedOrgName] = useState<string | null>(null); // Track the selected organization name

  // Function to fetch organizations from the backend API
  const fetchOrganizations = () => {
    console.log("Fetching organizations...");
    fetch(`${API_BASE_URL}/api/organizations`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched organizations:", data);
        setOrganizations(data); // Set organizations in state
      })
      .catch((err) => console.error("Error fetching organizations:", err));
  };

  // Function to fetch systems for a selected organization
  const fetchSystems = (orgId: string) => {
    console.log(`Fetching systems for organization ID: ${orgId}...`);
    fetch(`${API_BASE_URL}/api/organizations/${orgId}/systems`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Systems fetched from backend:", data);
        setSystems(data);
      })
      .catch((err) => console.error("Error fetching systems:", err));
  };

  // Fetch organizations when the component is mounted
  useEffect(() => {
    fetchOrganizations();
  }, []);

  // Function to handle selecting an organization
  const handleSelectOrganization = (
    selectedOrgId: string,
    selectedOrgName: string
  ) => {
    console.log(
      `Selected organization ID: ${selectedOrgId}, Name: ${selectedOrgName}`
    );
    setOrgId(selectedOrgId); // Set the selected organization's ID
    setSelectedOrgName(selectedOrgName); // Set the selected organization's name
    fetchSystems(selectedOrgId); // Fetch systems for the selected organization
  };

  // Function to handle deleting an organization
  const handleDeleteOrganization = (deleteOrgId: string) => {
    fetch(`${API_BASE_URL}/api/organizations/${deleteOrgId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete organization");
        }

        return response.json(); // Return json only if status is ok
      })
      .then(() => {
        console.log(`Organization ${deleteOrgId} deleted.`);

        // Only reset if the organization being deleted is currently selected
        if (orgId === deleteOrgId) {
          setOrgId(null); // Reset selected organization
          setSelectedOrgName(null); // Reset selected organization name
          setSystems([]); // Clear systems
        }

        // Update the organizations list by filtering out the deleted organization
        setOrganizations((prevOrganizations) =>
          prevOrganizations.filter((org) => org._id !== deleteOrgId)
        );
      })
      .catch((error) => console.error("Error deleting organization:", error));
  };

  // Function to handle updating an organization
  const handleUpdateOrganization = (orgId: string, newName: string) => {
    fetch(`${API_BASE_URL}/api/organizations/${orgId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newName }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update organization");
        }
        return response.json();
      })
      .then(() => {
        // Update the organization's name directly in the state
        setOrganizations((prevOrganizations) =>
          prevOrganizations.map((org) =>
            org._id === orgId ? { ...org, name: newName } : org
          )
        );

        // Update the selected organization name if it's the one being updated
        if (orgId === orgId) {
          setSelectedOrgName(newName); // Update displayed name
        }
      })
      .catch((error) => console.error("Error updating organization:", error));
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

          {/* Organization List with Edit and Delete */}
          <OrganizationList
            organizations={organizations}
            onSelect={handleSelectOrganization}
            onUpdate={handleUpdateOrganization} // Now expects orgId and newName
            onDelete={handleDeleteOrganization}
          />

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

                <div className="w-1/2">
                  <SystemForm
                    orgId={orgId!} // Pass the selected organization ID to SystemForm
                    onSystemAdded={() => {
                      console.log("System added, refetching systems...");
                      fetchSystems(orgId!); // Refresh systems list after adding a system
                    }}
                  />
                </div>
              </div>

              {systems.length > 0 ? (
                <div className="mt-8">
                  <SystemTable
                    systems={systems}
                    onDeleteSystem={(systemId) => {
                      console.log(`Deleting system with ID: ${systemId}`);
                      fetch(
                        `${API_BASE_URL}/api/organizations/${orgId}/systems/${systemId}`,
                        {
                          method: "DELETE",
                        }
                      ).then(() => {
                        console.log("System deleted, refetching systems...");
                        fetchSystems(orgId!);
                      });
                    }}
                    onEditSystem={(systemId) => {
                      const systemToEdit = systems.find(
                        (sys) => sys._id === systemId
                      );

                      if (!systemToEdit) return;

                      let updatedDetails = {};

                      if (systemToEdit.type === "workflowSystem") {
                        const updatedName = prompt(
                          "Enter updated workflow name",
                          systemToEdit.workflowSystem?.name || ""
                        );
                        const updatedWorkflow = prompt(
                          "Enter updated workflow items",
                          systemToEdit.workflowSystem?.workflow || ""
                        );

                        updatedDetails = {
                          name: updatedName
                            ? updatedName
                            : systemToEdit.workflowSystem?.name,
                          workflow: updatedWorkflow
                            ? updatedWorkflow
                            : systemToEdit.workflowSystem?.workflow,
                        };
                      } else if (systemToEdit.type === "vendorSystem") {
                        const updatedName = prompt(
                          "Enter updated vendor name",
                          systemToEdit.vendorSystem?.name || ""
                        );
                        const updatedClassification = prompt(
                          "Enter updated vendor classification",
                          systemToEdit.vendorSystem?.classification || ""
                        );
                        updatedDetails = {
                          name: updatedName
                            ? updatedName
                            : systemToEdit.vendorSystem?.name,
                          classification: updatedClassification
                            ? updatedClassification
                            : systemToEdit.vendorSystem?.classification,
                        };
                      } else if (systemToEdit.type === "vehicleSystem") {
                        const updatedYear = prompt(
                          "Enter updated vehicle year",
                          systemToEdit.vehicleSystem?.year?.toString() || ""
                        );
                        const updatedMake = prompt(
                          "Enter updated vehicle make",
                          systemToEdit.vehicleSystem?.make || ""
                        );
                        const updatedModel = prompt(
                          "Enter updated vehicle model",
                          systemToEdit.vehicleSystem?.model || ""
                        );
                        updatedDetails = {
                          year: updatedYear
                            ? updatedYear
                            : systemToEdit.vehicleSystem?.year,
                          make: updatedMake
                            ? updatedMake
                            : systemToEdit.vehicleSystem?.make,
                          model: updatedModel
                            ? updatedModel
                            : systemToEdit.vehicleSystem?.model,
                        };
                      }

                      fetch(
                        `${API_BASE_URL}/api/organizations/${orgId}/systems/${systemId}`,
                        {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            type: systemToEdit.type,
                            ...updatedDetails,
                          }),
                        }
                      ).then(() => {
                        console.log("System updated, refetching systems...");
                        fetchSystems(orgId!);
                      });
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
