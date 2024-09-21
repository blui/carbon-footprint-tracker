// client/src/components/SystemData.tsx

import React, { useEffect, useState } from "react";
import API_BASE_URL from "../config";

const SystemData = ({ systemId }: { systemId: string }) => {
  const [data, setData] = useState<any>(null); // Store the fetched data
  const [error, setError] = useState<string | null>(null); // Store any error messages

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Send a GET request to fetch emissions and recommendations for the system
        const response = await fetch(
          `${API_BASE_URL}/api/systems/${systemId}/data`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch system data");
        }

        const result = await response.json();
        setData(result); // Store the fetched data
      } catch (err: unknown) {
        setError(`Error fetching data: ${(err as Error).message}`);
      }
    };

    fetchData(); // Fetch data when the component is mounted
  }, [systemId]);

  if (error) return <p>{error}</p>;
  if (!data) return <p>Loading data...</p>;

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
