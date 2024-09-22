// client/src/components/OrganizationForm.tsx

import React, { useState } from "react"; // Import React and useState for state management
import API_BASE_URL from "../config"; // Import the base URL for API requests

// Define the props interface to specify the structure for the OrganizationForm component
interface OrganizationFormProps {
  onOrganizationCreated: (orgId: string, orgName: string) => void; // A callback prop for when a new organization is created
}

// The main OrganizationForm functional component
const OrganizationForm: React.FC<OrganizationFormProps> = ({
  onOrganizationCreated,
}) => {
  // State to store the organization's name entered by the user
  const [name, setName] = useState(""); // Initial state is an empty string

  // State to track errors, initially set to null (no errors)
  const [error, setError] = useState<string | null>(null);

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form behavior (page reload)
    setError(null); // Reset the error state before new submission

    try {
      // Send a POST request to the backend to create a new organization
      const response = await fetch(`${API_BASE_URL}/api/organizations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Specify that the request body is JSON
        body: JSON.stringify({ name }), // Send the organization name in the request body
      });

      if (!response.ok) {
        // If the response status is not ok, throw an error
        throw new Error("Failed to create organization");
      }

      // Parse the response JSON to retrieve the organization data
      const data = await response.json();

      // Call the parent component's onOrganizationCreated method to notify it of the new organization
      onOrganizationCreated(data._id, data.name);

      // Clear the input field after successfully creating the organization
      setName("");
    } catch (err: unknown) {
      // If there's an error, set the error state to display the error message
      setError(`Error creating organization: ${(err as Error).message}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit} // Attach the form submit handler
      className="mt-4 p-4 bg-neutral rounded-lg shadow-lg" // Apply Tailwind CSS styles for consistent look
    >
      <div className="mb-4">
        {/* Input field for organization name */}
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            console.log("Current Input Value: ", e.target.value); // Debugging to ensure it's working
          }}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary"
          style={{ color: "black", backgroundColor: "white" }} // Add inline styles for debugging
          placeholder="Enter organization name"
          required
        />
      </div>

      {/* Display error message if an error exists */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Button to submit the form and create a new organization */}
      <button
        type="submit" // Set the button type to submit the form
        className="w-full bg-primary text-white py-2 rounded-lg hover:bg-accent focus:outline-none focus:ring-2 focus:ring-accent" // Tailwind CSS styles for the button
      >
        Create Organization
      </button>
    </form>
  );
};

export default OrganizationForm;
