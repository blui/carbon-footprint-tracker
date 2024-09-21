import React, { useState } from "react";
import API_BASE_URL from "../config";

interface SystemFormProps {
  orgId: string; // Organization ID to associate the system with
  onSystemAdded: () => void; // Callback to notify when a system is added
}

const SystemForm: React.FC<SystemFormProps> = ({ orgId, onSystemAdded }) => {
  const [type, setType] = useState(""); // System type state
  const [details, setDetails] = useState(""); // System details state
  const [error, setError] = useState<string | null>(null); // Error state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear any previous errors

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

      onSystemAdded(); // Notify parent component (App.tsx) to refresh systems list
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
        placeholder="System Type"
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
