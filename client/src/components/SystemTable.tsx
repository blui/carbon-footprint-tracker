import React from "react";

// Define the System interface to represent a system object with optional fields for various types
interface System {
  _id: string;
  type: string; // The type of system (workflow, vendorSolution, vehicle)
  workflowItems?: string[]; // Array of workflow items (if the system is a workflow)
  vendorType?: string; // Vendor type (if the system is a vendor solution)
  vendorName?: string; // Vendor name (if the system is a vendor solution)
  year?: number; // Year of the vehicle (if the system is a vehicle)
  make?: string; // Make of the vehicle (if the system is a vehicle)
  model?: string; // Model of the vehicle (if the system is a vehicle)
}

// Props for the SystemTable component, which includes systems, delete, and edit handlers
interface SystemTableProps {
  systems: System[]; // Array of systems to be displayed in the table
  onDeleteSystem: (systemId: string) => void; // Callback function for deleting a system
  onEditSystem: (systemId: string) => void; // Callback function for editing a system
}

// Main component for displaying the systems in a table format
const SystemTable: React.FC<SystemTableProps> = ({
  systems,
  onDeleteSystem,
  onEditSystem,
}) => {
  return (
    <table className="min-w-full table-auto bg-white shadow-lg">
      <thead>
        <tr>
          <th className="px-4 py-2">Type</th> {/* Column for system type */}
          <th className="px-4 py-2">Details</th>{" "}
          {/* Column for system details */}
          <th className="px-4 py-2">Actions</th>{" "}
          {/* Column for action buttons (Edit/Delete) */}
        </tr>
      </thead>
      <tbody>
        {systems.map((system) => (
          <tr key={system._id}>
            <td className="border px-4 py-2">{system.type}</td>{" "}
            {/* Display system type */}
            <td className="border px-4 py-2">
              {/* Conditionally display the correct details based on the system type */}
              {system.type === "workflow" && (
                <ul>
                  {system.workflowItems?.map((item, index) => (
                    <li key={index}>{item}</li> // Display workflow items if it's a workflow system
                  ))}
                </ul>
              )}
              {system.type === "vendorSolution" && (
                <>
                  <p>Vendor Type: {system.vendorType}</p>
                  <p>Vendor Name: {system.vendorName}</p>
                </>
              )}
              {system.type === "vehicle" && (
                <>
                  <p>Year: {system.year}</p>
                  <p>Make: {system.make}</p>
                  <p>Model: {system.model}</p>
                </>
              )}
            </td>
            <td className="border px-4 py-2">
              {/* Edit button */}
              <button
                onClick={() => onEditSystem(system._id)}
                className="bg-yellow-500 text-white px-4 py-1 rounded mr-2 hover:bg-yellow-600"
              >
                Edit
              </button>
              {/* Delete button */}
              <button
                onClick={() => onDeleteSystem(system._id)}
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SystemTable;
