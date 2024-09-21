// client/src/components/OrganizationList.tsx

import React, { useEffect, useState } from "react";
import API_BASE_URL from "../config";

// Define TypeScript interfaces for System and Organization
interface System {
  _id: string; // Unique ID for each system
  type: string; // The type of system (e.g., "Supply Chain", "Vehicles")
  details: string; // Detailed description of the system
}

interface Organization {
  _id: string; // Unique ID for each organization
  name: string; // Organization name
  systems: System[]; // Array of systems associated with the organization
}

// Main component to display a list of organizations and their systems
const OrganizationList: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]); // State to hold fetched organizations

  // useEffect hook to fetch all organizations and their systems from the backend on component mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/organizations`)
      .then((res) => res.json())
      .then((data) => setOrganizations(data)) // Store the fetched data in state
      .catch((err) => console.error("Error fetching organizations:", err)); // Handle errors
  }, []); // Empty dependency array ensures this only runs once when the component mounts

  return (
    <div>
      <h2>All Organizations and Systems</h2>
      <div className="organization-grid">
        {/* If no organizations are available, display a message */}
        {organizations.length === 0 ? (
          <p>No organizations available.</p>
        ) : (
          // Map through each organization and display its details
          organizations.map((org) => (
            <div key={org._id} className="organization-card">
              <h3>{org.name}</h3>
              {/* Display associated systems if any are available */}
              {org.systems.length > 0 ? (
                <ul>
                  {org.systems.map((system) => (
                    <li key={system._id}>
                      <strong>{system.type}</strong>: {system.details}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No systems available for this organization.</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrganizationList;
