import React from 'react';

export const MetricSelector = ({
  selectedMetric,
  onMetricChange,
}) => {
  const metrics = ['cases', 'new_cases', 'deaths'];

  return (
    <div className="mb-4">
      <label htmlFor="metric" className="block text-sm font-medium text-gray-700">
        Select Metric
      </label>
      <select
        id="metric"
        value={selectedMetric}
        onChange={(e) => onMetricChange(e.target.value)}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        {metrics.map((metric) => (
          <option key={metric} value={metric}>
            {metric.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </option>
        ))}
      </select>
    </div>
  );
};

