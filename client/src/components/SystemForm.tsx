// client/src/components/SystemForm.tsx

import React, { useState } from "react";
import API_BASE_URL from "../config";

// Define props for the SystemForm component
interface SystemFormProps {
  orgId: string; // The organization ID to which the system will be added
  onSystemAdded: () => void; // Callback prop to notify the parent component when a system is added
}

// Main functional component for adding a system
const SystemForm: React.FC<SystemFormProps> = ({ orgId, onSystemAdded }) => {
  const [type, setType] = useState<string>(""); // State to store the system type
  const [details, setDetails] = useState<string>(""); // State to store system details
  const [error, setError] = useState<string | null>(null); // State to store error messages

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setError(null); // Reset error state

    try {
      // Send a POST request to add a system to the specified organization
      const response = await fetch(
        `${API_BASE_URL}/api/organizations/${orgId}/systems`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" }, // Set content type to JSON
          body: JSON.stringify({ type, details }), // Send the system data in the request body
        }
      );

      // If the response is not OK, throw an error
      if (!response.ok) {
        throw new Error("Failed to add system");
      }

      // Reset form fields after successful submission
      setType("");
      setDetails("");

      // Notify parent component that a system has been added successfully
      onSystemAdded();
    } catch (err: unknown) {
      // Handle any errors and display an error message
      setError(`Error adding system: ${(err as Error).message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add System</h2>
      {/* Input for system type */}
      <input
        type="text"
        value={type}
        onChange={(e) => setType(e.target.value)} // Update state as user types
        placeholder="System Type (e.g., Supply Chain, Vehicles)"
        required // Make input required
      />
      {/* Textarea for system details */}
      <textarea
        value={details}
        onChange={(e) => setDetails(e.target.value)} // Update state as user types
        placeholder="System Details"
        required // Make textarea required
      />
      {/* Submit button */}
      <button type="submit">Add System</button>

      {/* Display any error messages */}
      {error && <p>{error}</p>}
    </form>
  );
};

export default SystemForm;
