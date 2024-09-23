import React, { useState, useEffect } from "react";
import OrganizationForm from "./components/OrganizationForm";
import SystemForm from "./components/SystemForm";
import SystemTable from "./components/SystemTable"; // Import SystemTable component
import API_BASE_URL from "./config"; // Import API base URL

const App = () => {
  // State to manage the selected organization ID, list of systems, organizations, and the selected organization's name
  const [orgId, setOrgId] = useState<string | null>(null); // Track selected organization ID
  const [systems, setSystems] = useState<any[]>([]); // List of systems for the selected organization
  const [organizations, setOrganizations] = useState<any[]>([]); // List of organizations
  const [selectedOrgName, setSelectedOrgName] = useState<string | null>(null); // Track the selected organization name

  // Function to fetch organizations from the backend API
  const fetchOrganizations = () => {
    console.log("Fetching organizations...");
    fetch(`${API_BASE_URL}/api/organizations`)
      .then((res) => res.json()) // Parse the response to JSON
      .then((data) => {
        console.log("Fetched organizations:", data); // Log fetched organizations
        setOrganizations(data); // Set organizations in state
      })
      .catch((err) => console.error("Error fetching organizations:", err)); // Handle errors
  };

  // Function to fetch systems for a selected organization
  const fetchSystems = (orgId: string) => {
    console.log(`Fetching systems for organization ID: ${orgId}...`);
    fetch(`${API_BASE_URL}/api/organizations/${orgId}/systems`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Systems fetched from backend:", data); // Log systems data
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
    ); // Debugging: log selected organization details
    setOrgId(selectedOrgId); // Set the selected organization's ID
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
            {organizations.map((org) => (
              <li
                key={org._id}
                onClick={() => handleSelectOrganization(org._id, org.name)}
                className={`cursor-pointer py-2 px-4 bg-gray-700 rounded-lg ${
                  org._id === orgId
                    ? "bg-blue-500 text-white" // Highlight selected organization
                    : "bg-gray-700 text-gray-300" // Non-selected organizations
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
              {/* Display the selected organization's name */}
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
                    orgId={orgId!} // Pass the selected organization ID to SystemForm
                    onSystemAdded={() => {
                      console.log("System added, refetching systems..."); // Debugging: log when a system is added
                      fetchSystems(orgId!); // Refresh systems list after adding a system
                    }}
                  />
                </div>
              </div>

              {/* Systems Table displayed below both sections */}
              {systems.length > 0 ? (
                <div className="mt-8">
                  <SystemTable
                    systems={systems}
                    // Handle deleting a system
                    onDeleteSystem={(systemId) => {
                      console.log(`Deleting system with ID: ${systemId}`); // Debugging: log the system being deleted
                      fetch(
                        `${API_BASE_URL}/api/organizations/${orgId}/systems/${systemId}`,
                        {
                          method: "DELETE",
                        }
                      ).then(() => {
                        console.log("System deleted, refetching systems..."); // Debugging: log after deletion
                        fetchSystems(orgId!); // Refetch systems after deletion
                      });
                    }}
                    // Handle editing a system
                    onEditSystem={(systemId) => {
                      const systemToEdit = systems.find(
                        (sys) => sys._id === systemId
                      );

                      if (!systemToEdit) return;

                      let updatedDetails = {};

                      // Prompt user for updated values based on the type
                      if (systemToEdit.type === "workflowSystem") {
                        const updatedName = prompt(
                          "Enter updated workflow name",
                          systemToEdit.name || ""
                        );
                        const updatedWorkflow = prompt(
                          "Enter updated workflow items",
                          systemToEdit.workflow
                            ? systemToEdit.workflow.join(", ")
                            : ""
                        );

                        updatedDetails = {
                          name: updatedName ? updatedName : systemToEdit.name, // Use existing name if prompt is canceled or empty
                          workflow: updatedWorkflow
                            ? updatedWorkflow
                            : systemToEdit.workflow
                            ? systemToEdit.workflow.join(", ")
                            : "", // Ensure workflow is sent as a string
                        };
                      } else if (systemToEdit.type === "vendorSystem") {
                        const updatedName = prompt(
                          "Enter updated vendor name",
                          systemToEdit.name || ""
                        );
                        const updatedClassification = prompt(
                          "Enter updated vendor classification",
                          systemToEdit.classification || ""
                        );
                        updatedDetails = {
                          name: updatedName ? updatedName : systemToEdit.name,
                          classification: updatedClassification
                            ? updatedClassification
                            : systemToEdit.classification,
                        };
                      } else if (systemToEdit.type === "vehicleSystem") {
                        const updatedYear = prompt(
                          "Enter updated vehicle year",
                          systemToEdit.year?.toString() || ""
                        );
                        const updatedMake = prompt(
                          "Enter updated vehicle make",
                          systemToEdit.make || ""
                        );
                        const updatedModel = prompt(
                          "Enter updated vehicle model",
                          systemToEdit.model || ""
                        );
                        updatedDetails = {
                          year: updatedYear ? updatedYear : systemToEdit.year,
                          make: updatedMake ? updatedMake : systemToEdit.make,
                          model: updatedModel
                            ? updatedModel
                            : systemToEdit.model,
                        };
                      }

                      // Send the updated data to the backend
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
                        fetchSystems(orgId!); // Refetch systems after edit
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
