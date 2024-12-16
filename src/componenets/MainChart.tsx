import React, { useState, useEffect } from 'react';
import { DateRangePicker } from './DateRangePicker';
import { CountrySelector } from './CountrySelector';
import { MetricSelector } from './MetricSelector';
import Chart from './Chart';
import { MockDataInterface } from '../interfaces/global';
import axios from 'axios';

const generateCompleteData = () => {
  const countries = ["India", "USA", "France", "Germany", "Japan", "Australia", "Brazil", "Italy", "Canada", "Russia", "China"];
  const months = Array.from({length: 12}, (_, i) => {
    const month = (i + 1).toString().padStart(2, '0');
    return `2024-${month}-01`;
  });
  
  const mockData: MockDataInterface[] = [];
  
  countries.forEach(country => {
    let baseCases = 800 + Math.floor(Math.random() * 1000); // Random starting point
    let baseNewCases = 20 + Math.floor(Math.random() * 40);
    let baseDeaths = 5 + Math.floor(Math.random() * 10);
    
    months.forEach(timestamp => {
      // Add some variation to make the data more realistic
      baseCases += Math.floor(Math.random() * 100);
      baseNewCases += Math.floor(Math.random() * 10) - 5;
      baseDeaths += Math.floor(Math.random() * 3) - 1;
      
      mockData.push({
        timestamp,
        country,
        cases: baseCases,
        new_cases: Math.max(10, baseNewCases),
        deaths: Math.max(1, baseDeaths)
      });
    });
  });
  
  return mockData;
};

const mockData: MockDataInterface[] = generateCompleteData();

function MainChart() {
  const [data, setData] = useState<MockDataInterface[]>(mockData);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedMetric, setSelectedMetric] = useState('cases');

  useEffect(() => {
    filterData();
  }, [startDate, endDate, selectedCountries]);

  const filterData = () => {
    let filteredData = mockData;
    console.log("startdate =>", startDate)
    console.log("endDate =>", endDate)
    console.log("selected Countries =>", selectedCountries)

    if (startDate) {
      filteredData = filteredData.filter(d => d.timestamp >= startDate);
      console.log("Filtereed sdata", filterData)
    }
    if (endDate) {
      filteredData = filteredData.filter(d => d.timestamp <= endDate);
    }
    if (selectedCountries) {
      filteredData = filteredData.filter((d: MockDataInterface) => selectedCountries.includes(d.country));
    }

    setData(filteredData);
  };

  useEffect(() => {
      const fetchData = async () => {
        try {
          // const response = await fetch(`/api/data?start_date=${startDate}&end_date=${endDate}&country=${country}&metric=${metric}`);
          // const response = await fetch(`${process.env.REACT_PUBLIC_HOST}/api/covid/getdata`);
          const response = await axios.get(`https://cloudhouse-server.onrender.com/api/covid/getdata`);
          if (!response) {
            throw new Error("API Error: " + response);
          }
          const data = await response.data;
          console.log("data =>", data)
          // setData(data);
        } catch (error) {
          console.error("Error fetching data:", error);
          setData(mockData); // Fallback to mock data
        }
      };
  
      fetchData();
    }, []);

  return (
    <div  className="container flex flex-col space-x-10 my-1 mx-auto p-4">
      {/* <h1 className="text-3xl flex w-full justify-center font-bold mb-4">COVID-19 Dashboard</h1> */}
      <div  className="mb-4 flex flex-row flex-full justify-evenly items-center space-x-8">
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
      <div style={{display: "flex", width: "100%", margin: "15px 5px"}} className="flex w-full justify-center">
        <Chart data={data} metric={selectedMetric} />
      </div>
    </div>
  );
}

export default MainChart;

