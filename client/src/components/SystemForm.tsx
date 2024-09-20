// client/src/components/SystemForm.tsx

import React, { useState } from "react";

const SystemForm = ({ orgId }: { orgId: string }) => {
  const [type, setType] = useState("");
  const [details, setDetails] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(`/api/organizations/${orgId}/systems`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, details }),
    });
    const data = await response.json();
    console.log(data); // Display the created system
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
    </form>
  );
};

export default SystemForm;
