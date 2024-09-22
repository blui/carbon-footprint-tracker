import React, { useState } from "react";
import API_BASE_URL from "../config";

// Define the types of systems available
const systemTypes = ["Workflow", "Vendor Solution", "Vehicle"];

interface SystemFormProps {
  orgId: string; // The organization ID for which the system is being added
  onSystemAdded: () => void; // Callback to refresh systems after adding a new one
}

const SystemForm: React.FC<SystemFormProps> = ({ orgId, onSystemAdded }) => {
  const [selectedType, setSelectedType] = useState(systemTypes[0]); // Track selected system type
  const [workflowItems, setWorkflowItems] = useState<string[]>([]); // Items for workflows
  const [vendorType, setVendorType] = useState<string>(""); // Vendor type for vendor solutions
  const [vendorName, setVendorName] = useState<string>(""); // Vendor name for vendor solutions
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
      systemDetails = { workflowItems };
    } else if (selectedType === "Vendor Solution") {
      systemDetails = { vendorType, vendorName };
    } else if (selectedType === "Vehicle") {
      // Log vehicle info for debugging
      console.log("Vehicle info being submitted:", vehicleInfo);

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
            type: selectedType,
            ...systemDetails,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add system");
      }

      // Clear form fields on success
      setWorkflowItems([]);
      setVendorType("");
      setVendorName("");
      setVehicleInfo({ year: "", make: "", model: "" });
      onSystemAdded();
    } catch (err: unknown) {
      console.error("Error adding system:", err); // Log the error for debugging
      setError(`Error adding system: ${(err as Error).message}`);
    }
  };

  // Update the UI to show different fields based on the selected system type
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
        <div className="mb-4">
          <label className="block mb-2">Workflow Items</label>
          <textarea
            value={workflowItems.join(", ")}
            onChange={(e) => setWorkflowItems(e.target.value.split(", "))}
            className="w-full p-2 border rounded"
            placeholder="Enter workflow items separated by commas"
          />
        </div>
      )}

      {selectedType === "Vendor Solution" && (
        <div className="mb-4">
          <label className="block mb-2">Vendor Type</label>
          <input
            type="text"
            value={vendorType}
            onChange={(e) => setVendorType(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter vendor type"
          />
          <label className="block mb-2 mt-4">Vendor Name</label>
          <input
            type="text"
            value={vendorName}
            onChange={(e) => setVendorName(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter vendor name"
          />
        </div>
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
