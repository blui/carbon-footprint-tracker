// client/src/components/SystemForm.tsx

import React, { useState } from "react";
import API_BASE_URL from "../config";

// Define the props for the SystemForm component
interface SystemFormProps {
  organizations: { _id: string; name: string }[]; // Array of organizations
  onSystemAdded: () => void; // Callback for notifying the parent component
}

const SystemForm: React.FC<SystemFormProps> = ({
  organizations,
  onSystemAdded,
}) => {
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null); // Track selected organization ID
  const [type, setType] = useState<string>(""); // System type
  const [details, setDetails] = useState<string>(""); // System details
  const [error, setError] = useState<string | null>(null); // Error state

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setError(null); // Clear previous errors

    // Ensure an organization is selected
    if (!selectedOrgId) {
      setError("Please select an organization.");
      return;
    }

    try {
      // Send POST request to add a system to the selected organization
      const response = await fetch(
        `${API_BASE_URL}/api/organizations/${selectedOrgId}/systems`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, details }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add system");
      }

      // Clear form fields after successful submission
      setType("");
      setDetails("");

      onSystemAdded(); // Notify parent component to refresh system list
    } catch (err: unknown) {
      setError(`Error adding system: ${(err as Error).message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add System</h2>

      {/* Dropdown to select an organization */}
      <select
        value={selectedOrgId || ""}
        onChange={(e) => setSelectedOrgId(e.target.value)}
        required
      >
        <option value="">Select Organization</option>
        {organizations.map((org) => (
          <option key={org._id} value={org._id}>
            {org.name}
          </option>
        ))}
      </select>

      {/* Input field for system type */}
      <input
        type="text"
        value={type}
        onChange={(e) => setType(e.target.value)}
        placeholder="System Type (e.g., Supply Chain, Vehicles)"
        required
      />

      {/* Textarea for system details */}
      <textarea
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        placeholder="System Details"
        required
      />

      {/* Submit button */}
      <button type="submit">Add System</button>

      {/* Display any error messages */}
      {error && <p>{error}</p>}
    </form>
  );
};

export default SystemForm;
