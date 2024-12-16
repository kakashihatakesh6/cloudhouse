import React, { useEffect, useState } from 'react';
import uPlot from 'uplot';
import 'uplot/dist/uPlot.min.css';

const mockData = [
    { time: "2024-01-01T00:00:00Z", country: "USA", value: 100 },
    { time: "2024-01-01T00:00:00Z", country: "India", value: 200 },
    { time: "2024-02-01T00:00:00Z", country: "USA", value: 150 },
    { time: "2024-02-01T00:00:00Z", country: "India", value: 250 },
];

function DataVisualization() {
    const [data, setData] = useState([]);
    const [metric, setMetric] = useState('Cases');
    const [startDate, setStartDate] = useState('2024-01-01');
    const [endDate, setEndDate] = useState('2024-12-31');
    const [country, setCountry] = useState('');

    useEffect(() => {
        // Fetch data from API
        fetch(`/api/data?start_date=${startDate}&end_date=${endDate}&country=${country}&metric=${metric}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("API Error");
                }
                return response.json();
            })
            .then(data => setData(data))
            .catch(() => {
                console.warn("Failed to fetch data. Using mock data.");
                setData(mockData); // Fallback to mock data
            });
    }, [metric, startDate, endDate, country]);

    const formatDataForChart = () => {
        // Convert data into the uPlot expected format
        const timeSeries = [...new Set(data.map(item => new Date(item.time).getTime()))];
        const countries = [...new Set(data.map(item => item.country))];
        const series = countries.map(country =>
            timeSeries.map(
                time => data.find(item => new Date(item.time).getTime() === time && item.country === country)?.value || null
            )
        );

        return [timeSeries, ...series];
    };

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
    };

    useEffect(() => {
        if (data.length) {
            const uplotChart = new uPlot(chartOptions, formatDataForChart(), document.getElementById("chart"));
            return () => uplotChart.destroy();
        }
    }, [data]);

    return (
        <div className='flex flex-col justify-center bg-blue-600 w-full'>
            <div className='flex flex-row md:w-1/2 w-full justify-center bg-white'>
                <label className='text-2xl font-semibold'>Metric:</label>
                <select value={metric} onChange={e => setMetric(e.target.value)}>
                    <option value="Cases">Cases</option>
                    <option value="New Cases">New Cases</option>
                    <option value="Deaths">Deaths</option>
                </select>
                <label>Start Date:</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                <label>End Date:</label>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                <label>Country:</label>
                <input type="text" value={country} onChange={e => setCountry(e.target.value)} />
            </div>
            <div className='bg-green-200 text-white' id="chart"></div>
        </div>
    );
}

export default DataVisualization;
