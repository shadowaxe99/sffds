import React, { useEffect, useState } from 'react';
import { fetchData } from '../utils/api';
import { calculateMetrics } from '../utils/metrics';
import { BarChart, LineChart } from '../components/Charts';
import { Filter, Sort, DrillDown } from '../components/InteractiveFeatures';

const Analytics = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [drillDownData, setDrillDownData] = useState([]);
  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    fetchData()
      .then((response) => {
        setData(response.data);
        setFilteredData(response.data);
        setSortedData(response.data);
        setDrillDownData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    const calculatedMetrics = calculateMetrics(filteredData);
    setMetrics(calculatedMetrics);
  }, [filteredData]);

  const handleFilter = (filterValue) => {
    const filtered = data.filter((item) => item.category === filterValue);
    setFilteredData(filtered);
  };

  const handleSort = (sortValue) => {
    const sorted = [...filteredData].sort((a, b) => a[sortValue] - b[sortValue]);
    setSortedData(sorted);
  };

  const handleDrillDown = (drillDownValue) => {
    const drilledDown = filteredData.filter((item) => item.subcategory === drillDownValue);
    setDrillDownData(drilledDown);
  };

  return (
    <div>
      <h1>Analytics Dashboard</h1>
      <Filter data={data} onFilter={handleFilter} />
      <Sort data={filteredData} onSort={handleSort} />
      <DrillDown data={filteredData} onDrillDown={handleDrillDown} />
      <div>
        <h2>Key Performance Metrics</h2>
        <p>Engagement Rate: {metrics.engagementRate}</p>
        <p>Conversion Rate: {metrics.conversionRate}</p>
        <p>Revenue Generated: {metrics.revenueGenerated}</p>
      </div>
      <div>
        <h2>Data Visualization</h2>
        <BarChart data={sortedData} />
        <LineChart data={drillDownData} />
      </div>
    </div>
  );
};

export default Analytics;