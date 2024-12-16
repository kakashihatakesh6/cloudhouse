import React, { useEffect, useState, useRef } from 'react';
import uPlot from 'uplot';
import 'uplot/dist/uPlot.min.css';

const mockData = [
  { timestamp: "2024-01-01", country: "USA", cases: 1000, new_cases: 50, deaths: 10 },
  // ... other data points
];

function NewDataChart() {
  const [data, setData] = useState([]);
  const [metric, setMetric] = useState('cases');
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-12-31');
  const [country, setCountry] = useState('');
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await fetch(`/api/data?start_date=${startDate}&end_date=${endDate}&country=${country}&metric=${metric}`);
        const response = await fetch(`http://localhost:8000/api/covid/getdata`);
        if (!response.ok) {
          throw new Error("API Error: " + response.statusText);
        }
        const data = await response.json();
        console.log("data =>", data)
        setData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setData(mockData); // Fallback to mock data
      }
    };

    fetchData();
  }, [metric, startDate, endDate, country]);

  const formatDataForChart = () => {
    const timeSeries = data.map(item => new Date(item.timestamp).getTime());
    const countries = [...new Set(data.map(item => item.country))];
    const series = countries.map(country =>
      timeSeries.map(time => data.find(item => item.timestamp === new Date(time).toISOString() && item.country === country)?.[metric] || null)
    );

    return [timeSeries, ...series];
  };

  useEffect(() => {
    if (data.length) {
      const chartOptions = {
        width: 800,
        height: 400,
        scales: {
          x: { time: true },
          y: { auto: true },
        },
        series: [
          { label: "Time" },
          ...[...new Set(data.map(item => item.country))].map(country => ({ label: country })),
        ],
        hooks: {
          draw: [u => {
            const { ctx } = u;
            ctx.save();
            ctx.fillStyle = '#000';
            u.data.forEach((d, idx) => {
              if (idx > 0) {
                const prevPoint = u.data[idx - 1];
                const curPoint = d;
                if (curPoint !== null && prevPoint !== null) {
                  ctx.beginPath();
                  ctx.moveTo(u.valToPos(prevPoint[0]), u.valToPos(prevPoint[1]));
                  ctx.lineTo(u.valToPos(curPoint[0]), u.valToPos(curPoint[1]));
                  ctx.stroke();
                }
              }
            });
            ctx.restore();
          }],
        },
      };

      const uplotChart = new uPlot(chartOptions, formatDataForChart(), chartRef.current);

      return () => uplotChart.destroy();
    }
  }, [data]);

  return (
    <div className='flex flex-col justify-center bg-blue-600 w-full'>
      <div className='flex flex-row md:w-1/2 w-full justify-center bg-white'>
        <label className='text-2xl font-semibold'>Metric:</label>
        <select value={metric} onChange={e => setMetric(e.target.value)}>
          <option value="cases">Cases</option>
          <option value="new_cases">New Cases</option>
          <option value="deaths">Deaths</option>
        </select>
        <label>Start Date:</label>
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        <label>End Date:</label>
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        <label>Country:</label>
        <input type="text" value={country} onChange={e => setCountry(e.target.value)} />
      </div>
      <div className='bg-green-200 text-white' ref={chartRef}></div>
    </div>
  );
}

export default NewDataChart;