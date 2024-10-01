import React, { useState } from "react";
import API_BASE_URL from "../config";

// Define the types of systems available
const systemTypes = ["Workflow", "Vendor", "Vehicle"];

interface SystemFormProps {
  orgId: string; // The organization ID for which the system is being added
  onSystemAdded: () => void; // Callback to refresh systems after adding a new one
}

const SystemForm: React.FC<SystemFormProps> = ({ orgId, onSystemAdded }) => {
  const [selectedType, setSelectedType] = useState(systemTypes[0]); // Track selected system type
  const [workflowName, setWorkflowName] = useState<string>(""); // Name for workflow system
  const [workflow, setWorkflow] = useState<string>(""); // Workflow (as a single string)
  const [vendorName, setVendorName] = useState<string>(""); // Vendor name for vendor system
  const [vendorClassification, setVendorClassification] = useState<string>(""); // Vendor classification
  const [vehicleInfo, setVehicleInfo] = useState({
    year: "",
    make: "",
    model: "",
  }); // Vehicle information

  // New state for emissions and efficiency
  const [emissions, setEmissions] = useState<number | "">(""); // Track emissions value
  const [efficiency, setEfficiency] = useState<number | "">(""); // Track efficiency value

  const [error, setError] = useState<string | null>(null); // Track error message

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    let systemDetails;
    if (selectedType === "Workflow") {
      systemDetails = {
        name: workflowName,
        workflow, // Pass the workflow string directly
      };
    } else if (selectedType === "Vendor") {
      systemDetails = {
        name: vendorName,
        classification: vendorClassification,
      };
    } else if (selectedType === "Vehicle") {
      if (!vehicleInfo.year || !vehicleInfo.make || !vehicleInfo.model) {
        setError("Vehicle details are incomplete.");
        return;
      }
      systemDetails = {
        year: vehicleInfo.year,
        make: vehicleInfo.make,
        model: vehicleInfo.model,
      };
    }

    // Ensure emissions and efficiency are provided
    if (!emissions || !efficiency) {
      setError("Please provide both emissions and efficiency values.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/organizations/${orgId}/systems`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: selectedType.toLowerCase() + "System",
            emissions: emissions, // Include emissions
            efficiency: efficiency, // Include efficiency
            ...systemDetails,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add system");
      }

      // Clear form fields on success
      setWorkflowName("");
      setWorkflow("");
      setVendorName("");
      setVendorClassification("");
      setVehicleInfo({ year: "", make: "", model: "" });
      setEmissions(""); // Clear emissions
      setEfficiency(""); // Clear efficiency
      onSystemAdded();
    } catch (err: unknown) {
      console.error("Error adding system:", err); // Log the error for debugging
      setError(`Error adding system: ${(err as Error).message}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-gray-100 rounded-lg shadow-md"
      style={{
        height: "600px", // Adjusted for additional fields
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }} // Set fixed height and layout properties
    >
      <h2 className="text-xl font-semibold mb-4">Add System</h2>

      <label className="block mb-2" htmlFor="systemType">
        System Type
      </label>
      <select
        id="systemType" // Add an id to associate with the label
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      >
        {systemTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <div style={{ flexGrow: 1 }}>
        {/* Show fields based on selected system type */}
        {selectedType === "Workflow" && (
          <>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="workflowName">
                Workflow Name
              </label>
              <input
                id="workflowName"
                type="text"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter workflow name"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="workflowDescription">
                Workflow
              </label>
              <textarea
                id="workflowDescription"
                value={workflow}
                onChange={(e) => setWorkflow(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter workflow description or steps"
              />
            </div>
          </>
        )}

        {selectedType === "Vendor" && (
          <>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="vendorName">
                Vendor Name
              </label>
              <input
                id="vendorName"
                type="text"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter vendor name"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="vendorClassification">
                Vendor Classification
              </label>
              <input
                id="vendorClassification"
                type="text"
                value={vendorClassification}
                onChange={(e) => setVendorClassification(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter vendor classification"
              />
            </div>
          </>
        )}

        {selectedType === "Vehicle" && (
          <>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="vehicleYear">
                Vehicle Year
              </label>
              <input
                id="vehicleYear"
                type="text"
                value={vehicleInfo.year}
                onChange={(e) =>
                  setVehicleInfo({ ...vehicleInfo, year: e.target.value })
                }
                className="w-full p-2 border rounded mb-2"
                placeholder="Year"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="vehicleMake">
                Vehicle Make
              </label>
              <input
                id="vehicleMake"
                type="text"
                value={vehicleInfo.make}
                onChange={(e) =>
                  setVehicleInfo({ ...vehicleInfo, make: e.target.value })
                }
                className="w-full p-2 border rounded mb-2"
                placeholder="Make"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="vehicleModel">
                Vehicle Model
              </label>
              <input
                id="vehicleModel"
                type="text"
                value={vehicleInfo.model}
                onChange={(e) =>
                  setVehicleInfo({ ...vehicleInfo, model: e.target.value })
                }
                className="w-full p-2 border rounded"
                placeholder="Model"
              />
            </div>
          </>
        )}

        {/* Emissions and Efficiency fields for all systems */}
        <div className="mb-4">
          <label className="block mb-2" htmlFor="emissions">
            Emissions (kg CO2)
          </label>
          <input
            id="emissions"
            type="number"
            value={emissions}
            onChange={(e) => setEmissions(Number(e.target.value))}
            className="w-full p-2 border rounded"
            placeholder="Enter emissions"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="efficiency">
            Efficiency (%)
          </label>
          <input
            id="efficiency"
            type="number"
            value={efficiency}
            onChange={(e) => setEfficiency(Number(e.target.value))}
            className="w-full p-2 border rounded"
            placeholder="Enter efficiency"
          />
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded-lg"
      >
        Add System
      </button>
    </form>
  );
};

export default SystemForm;
