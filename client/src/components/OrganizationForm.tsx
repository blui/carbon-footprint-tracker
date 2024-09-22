// client/src/components/OrganizationForm.tsx

import React, { useState } from "react"; // Import React and the useState hook
import API_BASE_URL from "../config"; // Import the base URL for making API calls

// Define props expected by the OrganizationForm component
interface OrganizationFormProps {
  // Function prop that gets called when a new organization is created
  onOrganizationCreated: (orgId: string, orgName: string) => void;
}

// OrganizationForm component - allows users to create new organizations
const OrganizationForm: React.FC<OrganizationFormProps> = ({
  onOrganizationCreated,
}) => {
  const [name, setName] = useState(""); // State to store the organization name entered by the user
  const [error, setError] = useState<string | null>(null); // State to store any error messages

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior (page refresh)
    setError(null); // Clear previous error state before new submission

    try {
      // Make a POST request to create a new organization
      const response = await fetch(`${API_BASE_URL}/api/organizations`, {
        method: "POST", // Define the method as POST to send data to the server
        headers: { "Content-Type": "application/json" }, // Set request headers
        body: JSON.stringify({ name }), // Convert the name state to JSON for the request body
      });

      if (!response.ok) {
        // If the response status is not okay, throw an error
        throw new Error("Failed to create organization");
      }

      // Parse the response as JSON and extract the new organization's data
      const data = await response.json();
      // Notify the parent component of the newly created organization
      onOrganizationCreated(data._id, data.name);
      setName(""); // Reset the form's input field after successful submission
    } catch (err: unknown) {
      // Handle any errors by setting an error message
      setError(`Error creating organization: ${(err as Error).message}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 p-4 bg-gray-50 rounded-lg shadow-lg"
    >
      {/* The input field for entering the organization name */}
      <div className="mb-4">
        <input
          type="text"
          value={name} // Bind the input value to the name state
          onChange={(e) => setName(e.target.value)} // Update the state as the user types
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          placeholder="Enter organization name" // Placeholder serves as a label within the input field
          required // Make the input field required
        />
      </div>

      {/* Display any error message if one exists */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Submit button for creating an organization */}
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
