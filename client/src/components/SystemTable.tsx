import React from "react";

// Define the System interface
interface System {
  _id: string;
  type: string; // 'workflowSystem', 'vendorSystem', 'vehicleSystem'
  workflowSystem?: {
    name: string;
    workflow: string;
  }; // WorkflowSystem details
  vendorSystem?: {
    name: string;
    classification: string;
  }; // VendorSystem details
  vehicleSystem?: {
    year: number;
    make: string;
    model: string;
  }; // VehicleSystem details
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
                {/* WorkflowSystem Details */}
                {system.type === "workflowSystem" && system.workflowSystem && (
                  <>
                    <p>
                      <strong>Name:</strong>{" "}
                      {system.workflowSystem.name || "N/A"}
                    </p>
                    <p>
                      <strong>Workflow:</strong>{" "}
                      {system.workflowSystem.workflow || "No workflow items"}
                    </p>
                  </>
                )}

                {/* VendorSystem Details */}
                {system.type === "vendorSystem" && system.vendorSystem && (
                  <>
                    <p>
                      <strong>Name:</strong> {system.vendorSystem.name || "N/A"}
                    </p>
                    <p>
                      <strong>Classification:</strong>{" "}
                      {system.vendorSystem.classification || "N/A"}
                    </p>
                  </>
                )}

                {/* VehicleSystem Details */}
                {system.type === "vehicleSystem" && system.vehicleSystem && (
                  <>
                    <p>
                      <strong>Year:</strong>{" "}
                      {system.vehicleSystem.year || "N/A"}
                    </p>
                    <p>
                      <strong>Make:</strong>{" "}
                      {system.vehicleSystem.make || "N/A"}
                    </p>
                    <p>
                      <strong>Model:</strong>{" "}
                      {system.vehicleSystem.model || "N/A"}
                    </p>
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
