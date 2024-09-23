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

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/organizations/${orgId}/systems`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: selectedType.toLowerCase() + "System",
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
    >
      <h2 className="text-xl font-semibold mb-4">Add System</h2>

      <label className="block mb-2">System Type</label>
      <select
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

      {/* Show fields based on selected system type */}
      {selectedType === "Workflow" && (
        <>
          <div className="mb-4">
            <label className="block mb-2">Workflow Name</label>
            <input
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter workflow name"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Workflow</label>
            <textarea
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
            <label className="block mb-2">Vendor Name</label>
            <input
              type="text"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter vendor name"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Vendor Classification</label>
            <input
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
        <div className="mb-4">
          <label className="block mb-2">Vehicle Information</label>
          <input
            type="text"
            value={vehicleInfo.year}
            onChange={(e) =>
              setVehicleInfo({ ...vehicleInfo, year: e.target.value })
            }
            className="w-full p-2 border rounded mb-2"
            placeholder="Year"
          />
          <input
            type="text"
            value={vehicleInfo.make}
            onChange={(e) =>
              setVehicleInfo({ ...vehicleInfo, make: e.target.value })
            }
            className="w-full p-2 border rounded mb-2"
            placeholder="Make"
          />
          <input
            type="text"
            value={vehicleInfo.model}
            onChange={(e) =>
              setVehicleInfo({ ...vehicleInfo, model: e.target.value })
            }
            className="w-full p-2 border rounded"
            placeholder="Model"
          />
        </div>
      )}

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
