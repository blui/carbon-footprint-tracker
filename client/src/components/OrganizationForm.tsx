// client/src/components/OrganizationForm.tsx

import React, { useState } from "react";
import API_BASE_URL from "../config";

const OrganizationForm = () => {
  const [name, setName] = useState(""); // Store the organization name
  const [error, setError] = useState<string | null>(null); // Store any error messages

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear any previous errors

    try {
      // Send a POST request to create the organization
      const response = await fetch(`${API_BASE_URL}/api/organizations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error("Failed to create organization");
      }

      const data = await response.json();
      console.log("Organization created:", data);
    } catch (err: unknown) {
      setError(`Error creating organization: ${(err as Error).message}`); // Handle the error
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
