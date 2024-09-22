// client/src/components/SystemData.tsx

import React, { useEffect, useState } from "react"; // Import React and hooks
import API_BASE_URL from "../config"; // Import the base URL for making API calls

// Define the props interface to ensure type safety
interface SystemDataProps {
  systemId: string; // The unique ID of the system passed as a prop
}

// Main functional component to fetch and display system data (emissions, efficiency, recommendations)
const SystemData: React.FC<SystemDataProps> = ({ systemId }) => {
  const [data, setData] = useState<any>(null); // State to store the fetched system data
  const [error, setError] = useState<string | null>(null); // State to store any error messages

  // useEffect hook to fetch system data when the component mounts or when systemId changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Send GET request to fetch emissions and recommendations for the specified system
        const response = await fetch(
          `${API_BASE_URL}/api/systems/${systemId}/data`
        );

        if (!response.ok) {
          // If the response status is not ok, throw an error
          throw new Error("Failed to fetch system data");
        }

        // Parse the response as JSON and store the result in the data state
        const result = await response.json();
        setData(result); // Store the fetched data in the state
      } catch (err: unknown) {
        // Handle any errors by setting an error message
        setError(`Error fetching data: ${(err as Error).message}`);
      }
    };

    fetchData(); // Call the fetchData function to initiate the data fetching
  }, [systemId]); // The effect runs when the systemId prop changes

  // If there was an error fetching data, display the error message
  if (error) return <p>{error}</p>;

  // If the data is still being fetched, display a loading message
  if (!data) return <p>Loading data...</p>;

  // Once the data is fetched, display the system data (emissions, efficiency, and recommendations)
  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        Emissions and Recommendations
      </h2>
      <p className="mb-2">Emissions: {data.emissions}</p>
      <p className="mb-2">Efficiency: {data.efficiency}</p>
      <p className="mb-2">Recommendations: {data.recommendations}</p>
    </div>
  );
};

export default SystemData;
