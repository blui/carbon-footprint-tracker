// client/src/components/OrganizationForm.tsx

import React, { useState } from "react";
import API_BASE_URL from "../config";

interface OrganizationFormProps {
  onOrganizationCreated: (orgId: string, orgName: string) => void;
}

const OrganizationForm: React.FC<OrganizationFormProps> = ({
  onOrganizationCreated,
}) => {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/organizations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error("Failed to create organization");
      }

      const data = await response.json();
      onOrganizationCreated(data._id, data.name);
      setName(""); // Clear the form after submission
    } catch (err: unknown) {
      setError(`Error creating organization: ${(err as Error).message}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 p-4 bg-gray-50 rounded-lg shadow-lg"
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Create Organization
      </h2>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="organizationName">
          Organization Name
        </label>
        <input
          type="text"
          id="organizationName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          placeholder="Enter organization name"
          required
        />
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

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
