import React, { useState, useEffect } from 'react';
import { DateRangePicker } from './DateRangePicker';
import { CountrySelector } from './CountrySelector';
import { MetricSelector } from './MetricSelector';
import Chart from './Chart';
import axios from 'axios';

interface DataPoint {
  country: string;
  id: number;
  metric: string;
  time: string;
  value: number;
}

const mockData: DataPoint[] = [
  { country: 'Brazil', id: 7, metric: 'Cases', time: '2020-01-01T00:00:00Z', value: 1200 },
  { country: 'Brazil', id: 8, metric: 'New Cases', time: '2020-01-01T00:00:00Z', value: 60 },
  { country: 'Brazil', id: 9, metric: 'Deaths', time: '2020-01-01T00:00:00Z', value: 15 },
  // Add more data points as needed
];

function MainChart() {
  const [data, setData] = useState<DataPoint[]>(mockData);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedMetric, setSelectedMetric] = useState('Cases');

  useEffect(() => {
    filterData();
  }, [startDate, endDate, selectedCountries, selectedMetric]);

  const filterData = () => {
    let filteredData: DataPoint[] = mockData;

    if (startDate) {
      filteredData = filteredData.filter(d => new Date(d.time) >= new Date(startDate));
    }
    if (endDate) {
      filteredData = filteredData.filter(d => new Date(d.time) <= new Date(endDate));
    }
    if (selectedCountries.length > 0) {
      filteredData = filteredData.filter(d => selectedCountries.includes(d.country));
    }
    if (selectedMetric) {
      filteredData = filteredData.filter(d => d.metric === selectedMetric);
    }

    setData(filteredData);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_HOST}/api/covid/getdata`);
        if (!response) {
          throw new Error("API Error: " + response);
        }
        const apiData = response.data;
        setData(apiData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setData(mockData); // Fallback to mock data
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container flex flex-col space-x-10 my-1 mx-auto p-4">
      <div className="mb-4 flex flex-row flex-full justify-evenly items-center space-x-8">
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
        <CountrySelector
          selectedCountries={selectedCountries}
          onCountriesChange={setSelectedCountries}
          allCountries={[...new Set(mockData.map(d => d.country))]}
        />
        <MetricSelector
          selectedMetric={selectedMetric}
          onMetricChange={setSelectedMetric}
        />
      </div>
      <div style={{ display: "flex", width: "100%", margin: "15px 5px" }} className="flex w-full justify-center">
        <Chart data={data} metric={selectedMetric} />
      </div>
    </div>
  );
}

export default MainChart;
