// OrganizationList.tsx

import React from "react";

// Define the structure of an Organization object
interface Organization {
  _id: string; // Organization ID (MongoDB ObjectId)
  name: string; // Organization name
}

// Define the props expected by the OrganizationList component
interface OrganizationListProps {
  organizations: Organization[]; // Array of organizations to display
  onSelect: (orgId: string, orgName: string) => void; // Function to handle organization selection
  onUpdate: (orgId: string, newName: string) => void; // Updated to handle two arguments: orgId and newName
  onDelete: (orgId: string) => void; // Function to handle organization deletion
}

const OrganizationList: React.FC<OrganizationListProps> = ({
  organizations,
  onSelect,
  onUpdate,
  onDelete,
}) => {
  // Function to handle updating the organization name
  const handleEdit = (
    e: React.MouseEvent<HTMLButtonElement>,
    orgId: string,
    currentName: string
  ) => {
    e.stopPropagation(); // Prevent the row click from firing when editing
    const newName = prompt(
      "Enter a new name for the organization:",
      currentName
    );

    if (newName && newName !== currentName) {
      onUpdate(orgId, newName); // Pass both orgId and newName
    }
  };

  // Function to handle deleting an organization
  const handleDelete = (
    e: React.MouseEvent<HTMLButtonElement>,
    orgId: string,
    orgName: string
  ) => {
    e.stopPropagation(); // Prevent the row click from firing when deleting
    const confirmed = window.confirm(
      `Are you sure you want to delete the organization "${orgName}"? This will also delete all associated systems.`
    );

    if (confirmed) {
      onDelete(orgId); // Trigger parent deletion function
    }
  };

  return (
    <ul className="space-y-2">
      {organizations.map((org) => (
        <li
          key={org._id}
          onClick={() => onSelect(org._id, org.name)} // Make entire row clickable to select the organization
          className="flex justify-between items-center py-2 px-4 cursor-pointer hover:bg-gray-200 rounded-lg transition duration-200"
        >
          {/* Organization name */}
          <span className="text-lg text-blue-600">{org.name}</span>

          {/* Edit and Delete buttons */}
          <div>
            <button
              onClick={(e) => handleEdit(e, org._id, org.name)} // Pass event and prevent row click
              className="text-blue-500 mx-2"
            >
              Edit
            </button>
            <button
              onClick={(e) => handleDelete(e, org._id, org.name)} // Pass event and prevent row click
              className="text-red-500 mx-2"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default OrganizationList;
