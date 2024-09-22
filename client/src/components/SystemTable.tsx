import React from "react";

// Define the System interface
interface System {
  _id: string;
  type: string; // 'workflow', 'vendorSolution', 'vehicle'
  workflowItems?: string[]; // Workflow items (for 'workflow')
  vendorType?: string; // Vendor type (for 'vendorSolution')
  vendorName?: string; // Vendor name (for 'vendorSolution')
  year?: number; // Year of the vehicle (for 'vehicle')
  make?: string; // Make of the vehicle (for 'vehicle')
  model?: string; // Model of the vehicle (for 'vehicle')
}

// Props for SystemTable
interface SystemTableProps {
  systems: System[]; // Systems array to display
  onDeleteSystem: (systemId: string) => void; // Delete system handler
  onEditSystem: (systemId: string) => void; // Edit system handler
}

// Unified table that displays all system types with consistent column structure
const SystemTable: React.FC<SystemTableProps> = ({
  systems,
  onDeleteSystem,
  onEditSystem,
}) => {
  return (
    <>
      {/* Add the System Information title */}
      <h2 className="text-2xl font-semibold mb-6">System Information</h2>

      <table className="min-w-full table-auto bg-white shadow-lg">
        <thead>
          <tr>
            <th className="px-4 py-2 w-1/5">Type</th>
            <th className="px-4 py-2 w-2/5">Details</th>
            <th className="px-4 py-2 w-1/5">Actions</th>
          </tr>
        </thead>
        <tbody>
          {systems.map((system) => (
            <tr key={system._id}>
              <td className="border px-4 py-2">{system.type}</td>
              <td className="border px-4 py-2">
                {/* Workflow Items */}
                {system.type.toLowerCase() === "workflow" && (
                  <ul>
                    {system.workflowItems && system.workflowItems.length > 0
                      ? system.workflowItems.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))
                      : "No Workflow Items"}
                  </ul>
                )}
                {/* Vendor Solution Details */}
                {system.type.toLowerCase() === "vendorsolution" && (
                  <>
                    <p>Vendor Name: {system.vendorName || "N/A"}</p>
                    <p>Vendor Type: {system.vendorType || "N/A"}</p>
                  </>
                )}
                {/* Vehicle Details */}
                {system.type.toLowerCase() === "vehicle" && (
                  <>
                    <p>Year: {system.year || "N/A"}</p>
                    <p>Make: {system.make || "N/A"}</p>
                    <p>Model: {system.model || "N/A"}</p>
                  </>
                )}
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => onEditSystem(system._id)}
                  className="bg-yellow-500 text-white px-4 py-1 rounded mr-2 hover:bg-yellow-600"
                >
                  Edit
                </button>
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
    </>
  );
};

export default SystemTable;
