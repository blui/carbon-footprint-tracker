// client/src/components/SystemForm.tsx

import React, { useState } from "react"; // Import React and the useState hook
import API_BASE_URL from "../config"; // Import base URL for API requests

// Define the props interface for SystemForm
interface SystemFormProps {
  orgId: string; // The organization ID to which the system belongs
  onSystemAdded: () => void; // Callback function when a system is successfully added
}

// SystemForm component - Handles adding new systems to an organization
const SystemForm: React.FC<SystemFormProps> = ({ orgId, onSystemAdded }) => {
  // State for system type, system details, and error messages
  const [type, setType] = useState(""); // Store the system type (e.g., "Vehicles", "Supply Chain")
  const [details, setDetails] = useState(""); // Store additional details about the system
  const [error, setError] = useState<string | null>(null); // Error state to handle any errors during submission

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior (page refresh)
    setError(null); // Clear any previous error state before submitting

    try {
      // Send POST request to add a system to the organization
      const response = await fetch(
        `${API_BASE_URL}/api/organizations/${orgId}/systems`,
        {
          method: "POST", // Define the method as POST to send data
          headers: { "Content-Type": "application/json" }, // Specify JSON content
          body: JSON.stringify({ type, details }), // Convert system type and details to JSON
        }
      );

      if (!response.ok) {
        // If the response status is not ok, throw an error
        throw new Error("Failed to add system");
      }

      // Clear the form inputs upon successful system addition
      setType(""); // Reset system type field
      setDetails(""); // Reset system details field
      onSystemAdded(); // Call the callback function to update the parent component
    } catch (err: unknown) {
      // Set an error message in case the request fails
      setError(`Error adding system: ${(err as Error).message}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 p-4 bg-gray-50 rounded-lg shadow-lg" // Styling for the form container
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Add System</h2>{" "}
      {/* Form heading */}
      {/* Input field for system type */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="systemType">
          System Type
        </label>
        <input
          type="text"
          id="systemType"
          value={type} // Bind input value to type state
          onChange={(e) => setType(e.target.value)} // Update state on change
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          placeholder="Enter system type (e.g., Vehicles, Supply Chain)" // Input placeholder
          required // Mark the input as required
        />
      </div>
      {/* Textarea for system details */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="systemDetails">
          System Details
        </label>
        <textarea
          id="systemDetails"
          value={details} // Bind textarea value to details state
          onChange={(e) => setDetails(e.target.value)} // Update state on change
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          placeholder="Enter details for the system" // Textarea placeholder
          required // Mark the textarea as required
        />
      </div>
      {/* Display an error message if any */}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {/* Submit button for adding the system */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Add System
      </button>
    </form>
  );
};

export default SystemForm;
