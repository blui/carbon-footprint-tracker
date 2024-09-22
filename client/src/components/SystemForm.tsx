// client/src/components/SystemForm.tsx

import React, { useState } from "react"; // Import React and the useState hook
import API_BASE_URL from "../config"; // Import the base URL for API calls

// Define the types of systems available
const systemTypes = ["Workflow", "Vendor Solution", "Vehicle"];

interface SystemFormProps {
  orgId: string; // The organization ID for which the system is being added
  onSystemAdded: () => void; // Callback to refresh systems after adding a new one
}

// Main SystemForm component
const SystemForm: React.FC<SystemFormProps> = ({ orgId, onSystemAdded }) => {
  const [selectedType, setSelectedType] = useState(systemTypes[0]); // Track selected system type
  const [details, setDetails] = useState(""); // General details for the system
  const [workflowItems, setWorkflowItems] = useState<string[]>([]); // Items for workflows
  const [vendorName, setVendorName] = useState(""); // Vendor name for vendor solutions
  const [vehicleInfo, setVehicleInfo] = useState({
    year: "",
    make: "",
    model: "",
  }); // Vehicle information
  const [error, setError] = useState<string | null>(null); // Track error message

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setError(null); // Reset any previous error

    // Prepare the details based on the system type
    let systemDetails;
    if (selectedType === "Workflow") {
      systemDetails = { items: workflowItems }; // Workflow type details
    } else if (selectedType === "Vendor Solution") {
      systemDetails = { vendor: vendorName }; // Vendor solution details
    } else if (selectedType === "Vehicle") {
      systemDetails = vehicleInfo; // Vehicle details (year, make, model)
    }

    // Make the API request to add the system
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/organizations/${orgId}/systems`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: selectedType,
            details: systemDetails, // Send the appropriate system details
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add system");
      }

      // Clear the form fields upon successful submission
      setDetails("");
      setWorkflowItems([]);
      setVendorName("");
      setVehicleInfo({ year: "", make: "", model: "" });
      onSystemAdded(); // Refresh systems list after adding a new one
    } catch (err: unknown) {
      setError(`Error adding system: ${(err as Error).message}`);
    }
  };

  // Update the UI to show different fields based on the selected system type
  return (
    <form
      onSubmit={handleSubmit} // Handle form submission
      className="p-6 bg-gray-100 rounded-lg shadow-md" // Styling for the form container
    >
      <h2 className="text-xl font-semibold mb-4">Add System</h2>

      {/* Dropdown for system type selection */}
      <label className="block mb-2">System Type</label>
      <select
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)} // Update the selected type
        className="w-full mb-4 p-2 border rounded"
      >
        {systemTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      {/* Show additional fields based on selected system type */}
      {selectedType === "Workflow" && (
        <div className="mb-4">
          <label className="block mb-2">Workflow Items</label>
          {/* Input field for workflow items, separated by commas */}
          <textarea
            value={workflowItems.join(", ")} // Display joined workflow items
            onChange={(e) => setWorkflowItems(e.target.value.split(", "))} // Update workflow items
            className="w-full p-2 border rounded"
            placeholder="Enter workflow items separated by commas"
          />
        </div>
      )}

      {selectedType === "Vendor Solution" && (
        <div className="mb-4">
          <label className="block mb-2">Vendor Name</label>
          {/* Input field for vendor name */}
          <input
            type="text"
            value={vendorName}
            onChange={(e) => setVendorName(e.target.value)} // Update vendor name
            className="w-full p-2 border rounded"
            placeholder="Enter vendor name"
          />
        </div>
      )}

      {selectedType === "Vehicle" && (
        <div className="mb-4">
          <label className="block mb-2">Vehicle Information</label>
          {/* Input fields for vehicle year, make, and model */}
          <input
            type="text"
            value={vehicleInfo.year}
            onChange={
              (e) => setVehicleInfo({ ...vehicleInfo, year: e.target.value }) // Update vehicle year
            }
            className="w-full p-2 border rounded mb-2"
            placeholder="Year"
          />
          <input
            type="text"
            value={vehicleInfo.make}
            onChange={
              (e) => setVehicleInfo({ ...vehicleInfo, make: e.target.value }) // Update vehicle make
            }
            className="w-full p-2 border rounded mb-2"
            placeholder="Make"
          />
          <input
            type="text"
            value={vehicleInfo.model}
            onChange={
              (e) => setVehicleInfo({ ...vehicleInfo, model: e.target.value }) // Update vehicle model
            }
            className="w-full p-2 border rounded"
            placeholder="Model"
          />
        </div>
      )}

      {/* Display error message if there's an error */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Submit button to add the system */}
      <button
        type="submit" // Submit the form when clicked
        className="w-full bg-blue-600 text-white p-2 rounded-lg"
      >
        Add System
      </button>
    </form>
  );
};

export default SystemForm;
