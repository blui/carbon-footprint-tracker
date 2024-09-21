// client/src/components/SystemData.tsx

import React, { useEffect, useState } from "react";
import API_BASE_URL from "../config";

// Define the props interface to ensure type safety
interface SystemDataProps {
  systemId: string; // The system's unique ID passed as a prop
}

// Main functional component to fetch and display system data (emissions, efficiency, and recommendations)
const SystemData: React.FC<SystemDataProps> = ({ systemId }) => {
  const [data, setData] = useState<any>(null); // State to store the fetched data
  const [error, setError] = useState<string | null>(null); // State to store any error messages

  // useEffect hook to fetch system data when the component mounts or when systemId changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Send GET request to fetch emissions and recommendations for the system
        const response = await fetch(
          `${API_BASE_URL}/api/systems/${systemId}/data`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch system data"); // Handle response errors
        }

        const result = await response.json();
        setData(result); // Store the fetched data in the state
      } catch (err: unknown) {
        // Set an error message in case of request failure
        setError(`Error fetching data: ${(err as Error).message}`);
      }
    };

    fetchData(); // Call the fetchData function
  }, [systemId]); // Dependency array ensures the effect runs when systemId changes

  // If there was an error fetching data, display the error message
  if (error) return <p>{error}</p>;

  // If data hasn't been fetched yet, display a loading message
  if (!data) return <p>Loading data...</p>;

  // Once the data is fetched, display the system data (emissions, efficiency, and recommendations)
  return (
    <div>
      <h2>Emissions and Recommendations</h2>
      <p>Emissions: {data.emissions}</p>
      <p>Efficiency: {data.efficiency}</p>
      <p>Recommendations: {data.recommendations}</p>
    </div>
  );
};

export default SystemData;
