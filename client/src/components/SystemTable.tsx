// client/src/components/SystemTable.tsx

import React, { useState } from "react";
import API_BASE_URL from "../config"; // Import base URL for API requests

// Define the props for the SystemTable component
interface SystemTableProps {
  systems: any[]; // List of systems passed as a prop
  orgId: string; // Organization ID
  onSystemUpdated: () => void; // Callback to refresh systems after an update
}

const SystemTable: React.FC<SystemTableProps> = ({
  systems,
  orgId,
  onSystemUpdated,
}) => {
  const [editMode, setEditMode] = useState<string | null>(null); // Track system being edited
  const [type, setType] = useState(""); // Track edited type
  const [details, setDetails] = useState(""); // Track edited details

  // Function to handle system update
  const handleUpdateSystem = async (systemId: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/organizations/${orgId}/systems/${systemId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, details }), // Send updated type and details
        }
      );
      if (!response.ok) throw new Error("Failed to update system");

      onSystemUpdated(); // Refresh systems list
      setEditMode(null); // Exit edit mode
    } catch (err) {
      console.error(`Error updating system: ${(err as Error).message}`);
    }
  };

  // Function to handle system deletion
  const handleDeleteSystem = async (systemId: string) => {
    if (window.confirm("Are you sure you want to delete this system?")) {
      try {
        await fetch(
          `${API_BASE_URL}/api/organizations/${orgId}/systems/${systemId}`,
          {
            method: "DELETE",
          }
        );
        onSystemUpdated(); // Refresh systems list
      } catch (err) {
        console.error(`Error deleting system: ${(err as Error).message}`);
      }
    }
  };

  return (
    <table className="min-w-full bg-white border border-gray-300 mt-4">
      <thead>
        <tr>
          <th className="py-2 px-4 border-b">Type</th>
          <th className="py-2 px-4 border-b">Details</th>
          <th className="py-2 px-4 border-b">Actions</th>
        </tr>
      </thead>
      <tbody>
        {systems.map((system) => (
          <tr key={system._id} className="text-center">
            {editMode === system._id ? (
              <>
                <td className="py-2 px-4 border-b">
                  <input
                    type="text"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg"
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  <input
                    type="text"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg"
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleUpdateSystem(system._id)}
                    className="bg-blue-600 text-white py-1 px-3 rounded-lg mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditMode(null)}
                    className="bg-gray-400 text-white py-1 px-3 rounded-lg"
                  >
                    Cancel
                  </button>
                </td>
              </>
            ) : (
              <>
                <td className="py-2 px-4 border-b">{system.type}</td>
                <td className="py-2 px-4 border-b">{system.details}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => {
                      setEditMode(system._id);
                      setType(system.type);
                      setDetails(system.details);
                    }}
                    className="text-blue-500 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSystem(system._id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SystemTable;
