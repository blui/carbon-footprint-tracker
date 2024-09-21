// client/src/components/SystemForm.tsx

import React, { useState } from "react";
import API_BASE_URL from "../config";

interface SystemFormProps {
  orgId: string;
  onSystemAdded: () => void;
}

const SystemForm: React.FC<SystemFormProps> = ({ orgId, onSystemAdded }) => {
  const [type, setType] = useState("");
  const [details, setDetails] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/organizations/${orgId}/systems`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, details }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add system");
      }

      // Clear the form after a successful addition
      setType("");
      setDetails("");
      onSystemAdded();
    } catch (err: unknown) {
      setError(`Error adding system: ${(err as Error).message}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 p-4 bg-gray-50 rounded-lg shadow-lg"
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Add System</h2>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="systemType">
          System Type
        </label>
        <input
          type="text"
          id="systemType"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          placeholder="Enter system type (e.g., Vehicles, Supply Chain)"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="systemDetails">
          System Details
        </label>
        <textarea
          id="systemDetails"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          placeholder="Enter details for the system"
          required
        />
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

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
