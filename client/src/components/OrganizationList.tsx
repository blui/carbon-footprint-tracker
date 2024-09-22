// client/src/components/OrganizationList.tsx

import React from "react"; // Import React
import API_BASE_URL from "../config"; // Import the base URL for API calls

// Define the structure of an Organization object
interface Organization {
  _id: string; // Organization ID (MongoDB ObjectId)
  name: string; // Organization name
}

// Define the props expected by the OrganizationList component
interface OrganizationListProps {
  organizations: Organization[]; // Array of organizations to display
  onSelect: (orgId: string, orgName: string) => void; // Function to handle organization selection
  onUpdate: (orgId: string) => void; // Function to handle organization update
  onDelete: (orgId: string) => void; // Function to handle organization deletion
}

// OrganizationList component - Displays a list of organizations with options to select, edit, and delete
const OrganizationList: React.FC<OrganizationListProps> = ({
  organizations,
  onSelect,
  onUpdate,
  onDelete,
}) => {
  return (
    <ul className="space-y-2">
      {" "}
      {/* Unordered list with space between list items */}
      {organizations.map((org) => (
        <li
          key={org._id} // Use the organization ID as a unique key
          className="flex justify-between items-center py-2" // Flexbox for alignment
        >
          {/* Organization name - clickable to select the organization */}
          <span
            onClick={() => onSelect(org._id, org.name)} // Call the onSelect prop when clicked
            className="cursor-pointer text-lg text-blue-600" // Style to make it look clickable
          >
            {org.name}
          </span>

          {/* Edit and Delete buttons */}
          <div>
            <button
              onClick={() => onUpdate(org._id)} // Call the onUpdate prop when the "Edit" button is clicked
              className="text-blue-500 mx-2" // Styling for the "Edit" button
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(org._id)} // Call the onDelete prop when the "Delete" button is clicked
              className="text-red-500 mx-2" // Styling for the "Delete" button
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
