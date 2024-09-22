// client/src/components/OrganizationForm.tsx

import React, { useState } from "react";
import API_BASE_URL from "../config"; // Import base URL for API calls

interface OrganizationFormProps {
  onOrganizationCreated: (orgId: string, orgName: string) => void; // Prop passed from parent component to handle organization creation
}

const OrganizationForm: React.FC<OrganizationFormProps> = ({
  onOrganizationCreated,
}) => {
  const [name, setName] = useState(""); // State to store the name of the organization
  const [error, setError] = useState<string | null>(null); // State to store any error messages

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setError(null); // Reset error state

    try {
      // Make POST request to create a new organization
      const response = await fetch(`${API_BASE_URL}/api/organizations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }), // Send the organization name in the request body
      });

      if (!response.ok) {
        // If the request fails, throw an error
        throw new Error("Failed to create organization");
      }

      // Parse the JSON response and pass the new organization's data to the parent component
      const data = await response.json();
      onOrganizationCreated(data._id, data.name); // Notify parent about the newly created organization
      setName(""); // Reset the form by clearing the input field
    } catch (err: unknown) {
      // Catch any errors and set an appropriate error message
      setError(`Error creating organization: ${(err as Error).message}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 p-4 bg-gray-50 rounded-lg shadow-lg"
    >
      {/* Removed the 'Organization Name' label as per the update */}

      <div className="mb-4">
        {/* Input field with a placeholder for entering organization name */}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)} // Update state when the user types
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          placeholder="Enter organization name" // Placeholder serves as a label for the input
          required
        />
      </div>

      {/* If there's an error, display the error message */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Submit button to create a new organization */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Create Organization
      </button>
    </form>
  );
};

export default OrganizationForm;
