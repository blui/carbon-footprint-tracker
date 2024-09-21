// client/src/components/SystemForm.tsx

import React, { useState } from "react";
import API_BASE_URL from "../config";

const SystemForm = ({ orgId }: { orgId: string }) => {
  const [type, setType] = useState(""); // Store the system type
  const [details, setDetails] = useState(""); // Store the system details
  const [error, setError] = useState<string | null>(null); // Store any error messages

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Send a POST request to add the system to the organization
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

      const data = await response.json();
      console.log("System added:", data);
    } catch (err: unknown) {
      setError(`Error adding system: ${(err as Error).message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add System</h2>
      <input
        type="text"
        value={type}
        onChange={(e) => setType(e.target.value)}
        placeholder="System Type (e.g., Supply Chain, Vehicles)"
        required
      />
      <textarea
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        placeholder="System Details"
        required
      />
      <button type="submit">Add System</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default SystemForm;
