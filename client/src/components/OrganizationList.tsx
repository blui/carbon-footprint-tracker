// client/src/components/OrganizationList.tsx

import React from "react";
import API_BASE_URL from "../config";

interface Organization {
  _id: string;
  name: string;
}

interface OrganizationListProps {
  organizations: Organization[];
  onSelect: (orgId: string, orgName: string) => void;
  onUpdate: (orgId: string) => void; // Pass update function
  onDelete: (orgId: string) => void; // Pass delete function
}

const OrganizationList: React.FC<OrganizationListProps> = ({
  organizations,
  onSelect,
  onUpdate,
  onDelete,
}) => {
  return (
    <ul className="space-y-2">
      {organizations.map((org) => (
        <li key={org._id} className="flex justify-between items-center py-2">
          <span
            onClick={() => onSelect(org._id, org.name)}
            className="cursor-pointer text-lg text-blue-600"
          >
            {org.name}
          </span>
          <div>
            <button
              onClick={() => onUpdate(org._id)}
              className="text-blue-500 mx-2"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(org._id)}
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
