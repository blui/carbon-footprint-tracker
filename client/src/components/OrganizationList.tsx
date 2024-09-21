// client/src/components/OrganizationList.tsx

import React from "react";

// Define interfaces for the Organization and System
interface Organization {
  _id: string;
  name: string;
}

// Define props for the OrganizationList component
interface OrganizationListProps {
  organizations: Organization[]; // Array of organizations
  onSelect: (selectedOrgId: string, selectedOrgName: string) => void; // Callback to handle organization selection
}

// Main component to display a list of organizations and trigger the selection
const OrganizationList: React.FC<OrganizationListProps> = ({
  organizations,
  onSelect,
}) => {
  return (
    <div>
      <h3>Organizations</h3>
      <ul>
        {organizations.length === 0 ? (
          <p>No organizations available.</p>
        ) : (
          organizations.map((org) => (
            <li
              key={org._id}
              onClick={() => onSelect(org._id, org.name)} // Trigger the onSelect function when an organization is clicked
              style={{ cursor: "pointer", padding: "10px 0", color: "#0078D4" }}
            >
              {org.name}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default OrganizationList;
