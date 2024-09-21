import React, { useState } from "react";
import API_BASE_URL from "../config";

interface OrganizationFormProps {
  onOrganizationCreated: (orgId: string, orgName: string) => void; // Prop to notify when organization is created
}

const OrganizationForm: React.FC<OrganizationFormProps> = ({
  onOrganizationCreated,
}) => {
  const [name, setName] = useState(""); // State to hold the organization name
  const [error, setError] = useState<string | null>(null); // Error state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear any previous errors

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
      onOrganizationCreated(data._id, data.name); // Notify parent component (App.tsx)
    } catch (err: unknown) {
      setError(`Error creating organization: ${(err as Error).message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Organization</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Organization Name"
        required
      />
      <button type="submit">Create</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default OrganizationForm;
