// client/src/components/OrganizationForm.tsx

import React, { useState } from "react";
import API_BASE_URL from "../config";

// Define the props expected by the OrganizationForm component
interface OrganizationFormProps {
  onOrganizationCreated: (orgId: string, orgName: string) => void; // Function prop to notify parent component when organization is created
}

// Main functional component for creating an organization
const OrganizationForm: React.FC<OrganizationFormProps> = ({
  onOrganizationCreated,
}) => {
  const [name, setName] = useState<string>(""); // State to store the organization name
  const [error, setError] = useState<string | null>(null); // State to store any error messages

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setError(null); // Reset any previous error messages

    try {
      // Send a POST request to the backend API to create a new organization
      const response = await fetch(`${API_BASE_URL}/api/organizations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Specify JSON content
        body: JSON.stringify({ name }), // Send the organization name in the request body
      });

      // Handle any error responses
      if (!response.ok) {
        throw new Error("Failed to create organization");
      }

      // Parse the response data
      const data = await response.json();

      // Notify the parent component that a new organization was created
      onOrganizationCreated(data._id, data.name);

      // Reset the form by clearing the input field
      setName("");
    } catch (err: unknown) {
      // Set an error message if the request fails
      setError(`Error creating organization: ${(err as Error).message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Organization</h2>
      {/* Input field for organization name */}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)} // Update state as user types
        placeholder="Organization Name"
        required // Field is required
      />
      {/* Submit button */}
      <button type="submit">Create</button>

      {/* Display any error messages */}
      {error && <p>{error}</p>}
    </form>
  );
};

export default OrganizationForm;
