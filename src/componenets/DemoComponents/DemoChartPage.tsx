import React, { useState, useEffect, Suspense } from 'react';
import { format, parse } from 'date-fns';
import { mockData } from '../../utils/MockData';
import DateRangePicker from './date-range-picker';

// Lazy load the CovidChart component
const CovidChart = React.lazy(() => import('./covid-chart'));

const countries = ['USA', 'India', 'Brazil', 'France', 'Germany', 'UK', 'Italy', 'Spain', 'Japan', 'Canada'];
const metrics = ['Total Cases', 'New Cases', 'Deaths'];

export default function DemoChartPage() {
  const [dateRange, setDateRange] = useState({
    from: parse(mockData[0].date, 'yyyy-MM-dd', new Date()),
    to: parse(mockData[mockData.length - 1].date, 'yyyy-MM-dd', new Date()),
  });
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['Total Cases']);

  const filteredData = mockData.filter((d) => {
    const date = parse(d.date, 'yyyy-MM-dd', new Date());
    return (
      date >= dateRange.from &&
      date <= dateRange.to &&
      d.country === selectedCountry
    );
  });

  const MetricSelector: React.FC = () => (
    <div className="flex flex-wrap gap-4">
      {metrics.map((metric) => (
        <label key={metric} className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={selectedMetrics.includes(metric)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedMetrics([...selectedMetrics, metric]);
              } else {
                setSelectedMetrics(selectedMetrics.filter(m => m !== metric));
              }
            }}
            className="form-checkbox h-4 w-4 text-blue-600"
          />
          <span>{metric}</span>
        </label>
      ))}
    </div>
  );

  const handleMetricChange = (metric: string, checked: boolean) => {
    if (checked) {
      setSelectedMetrics([...selectedMetrics, metric]);
    } else {
      if (selectedMetrics.length > 1) {
        setSelectedMetrics(selectedMetrics.filter(m => m !== metric));
      }
    }
  };

  return (
    <div className="h-screen p-4 flex flex-col">
      <h1 className="text-2xl font-bold mb-4">COVID-19 Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Date Range Picker */}
        <div className="bg-white p-3 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Date Range</h2>
          <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
        </div>

        {/* Country Selector */}
        <div className="bg-white p-3 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Country</h2>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {/* Metric Selector */}
        <div className="bg-white p-3 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Metrics</h2>
          <MetricSelector />
        </div>
      </div>

      {/* Charts Section - Using flex-grow to take remaining space */}
      {filteredData.length > 0 && (
        <div className="flex-grow bg-white rounded-lg shadow">
          <div className="h-full p-4">
            <Suspense fallback={<div>Loading chart...</div>}>
              <CovidChart 
                data={filteredData} 
                selectedMetrics={selectedMetrics}
              />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
}
