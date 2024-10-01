import React from "react";

// Define the System interface
interface System {
  _id: string;
  type: string; // 'workflowSystem', 'vendorSystem', 'vehicleSystem'
  emissions: number; // Emissions value for the system
  efficiency: number; // Efficiency value for the system
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

// A helper function to render each system type table
const renderTable = (
  systems: System[],
  onDeleteSystem: (systemId: string) => void,
  onEditSystem: (systemId: string) => void,
  systemType: string,
  columns: React.ReactNode
) => {
  return (
    <table className="min-w-full table-auto bg-white shadow-lg mb-6">
      <thead>
        <tr>
          {columns}
          <th className="px-4 py-2 w-1/5">Emissions (kg CO2)</th>
          <th className="px-4 py-2 w-1/5">Efficiency (%)</th>
          <th className="px-4 py-2 w-1/5">Actions</th>
        </tr>
      </thead>
      <tbody>
        {systems
          .filter((system) => system.type === systemType)
          .map((system) => (
            <tr key={system._id}>
              {/* WorkflowSystem Details */}
              {system.type === "workflowSystem" && system.workflowSystem && (
                <>
                  <td className="border px-4 py-2">
                    {system.workflowSystem.name || "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    {system.workflowSystem.workflow || "No workflow items"}
                  </td>
                </>
              )}

              {/* VendorSystem Details */}
              {system.type === "vendorSystem" && system.vendorSystem && (
                <>
                  <td className="border px-4 py-2">
                    {system.vendorSystem.name || "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    {system.vendorSystem.classification || "N/A"}
                  </td>
                </>
              )}

              {/* VehicleSystem Details */}
              {system.type === "vehicleSystem" && system.vehicleSystem && (
                <>
                  <td className="border px-4 py-2">
                    {system.vehicleSystem.year || "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    {system.vehicleSystem.make || "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    {system.vehicleSystem.model || "N/A"}
                  </td>
                </>
              )}

              {/* Common Emissions and Efficiency columns */}
              <td className="border px-4 py-2">
                {system.emissions !== undefined ? system.emissions : "N/A"}
              </td>
              <td className="border px-4 py-2">
                {system.efficiency !== undefined ? system.efficiency : "N/A"}
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
  );
};

const SystemTable: React.FC<SystemTableProps> = ({
  systems,
  onDeleteSystem,
  onEditSystem,
}) => {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-6">Workflow Systems</h2>
      {renderTable(
        systems,
        onDeleteSystem,
        onEditSystem,
        "workflowSystem",
        <>
          <th className="px-4 py-2">Name</th>
          <th className="px-4 py-2">Workflow</th>
        </>
      )}

      <h2 className="text-2xl font-semibold mb-6">Vendor Systems</h2>
      {renderTable(
        systems,
        onDeleteSystem,
        onEditSystem,
        "vendorSystem",
        <>
          <th className="px-4 py-2">Vendor Name</th>
          <th className="px-4 py-2">Classification</th>
        </>
      )}

      <h2 className="text-2xl font-semibold mb-6">Vehicle Systems</h2>
      {renderTable(
        systems,
        onDeleteSystem,
        onEditSystem,
        "vehicleSystem",
        <>
          <th className="px-4 py-2">Year</th>
          <th className="px-4 py-2">Make</th>
          <th className="px-4 py-2">Model</th>
        </>
      )}
    </>
  );
};

export default SystemTable;
