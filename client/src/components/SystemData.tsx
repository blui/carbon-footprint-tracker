// client/src/components/SystemData.tsx

import React, { useEffect, useState } from "react";

const SystemData = ({ systemId }: { systemId: string }) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/systems/${systemId}/data`);
      const result = await response.json();
      setData(result);
    };

    fetchData();
  }, [systemId]);

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
