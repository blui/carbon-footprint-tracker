// client/src/components/OrganizationForm.tsx

import React, { useState } from "react";

const OrganizationForm = () => {
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/organizations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await response.json();
    console.log(data); // Display the created organization
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
    </form>
  );
};

export default OrganizationForm;
