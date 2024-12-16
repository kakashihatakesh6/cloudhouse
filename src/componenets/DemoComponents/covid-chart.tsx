'use client'

import { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { format, parse } from 'date-fns'
import { DataPoint } from '../../utils/MockData'
import { Formatter } from 'recharts/types/component/DefaultTooltipContent'

interface CovidChartProps {
  data: DataPoint[]
  selectedMetrics: string[]
}

export default function CovidChart({ data, selectedMetrics }: CovidChartProps) {
  const [chartData, setChartData] = useState<DataPoint[]>([])

  useEffect(() => {
    setChartData(data)
  }, [data])

  const formatXAxis = (tickItem: string) => {
    const date = parse(tickItem, 'yyyy-MM-dd', new Date())
    return format(date, 'MMM yyyy')
  }

  const formatTooltip: Formatter<number, string> = (
    value,
    name,
    item
  ) => {
    const date = parse(item.payload.date, 'yyyy-MM-dd', new Date());
    return [
      `${value.toLocaleString()}`,
      format(date, 'MMM dd, yyyy')
    ];
  };

  const renderLines = () => {
    if (selectedMetrics.includes('All')) {
      return (
        <>
          <Line
            type="monotone"
            dataKey="cases"
            name="Total Cases"
            stroke="#2563eb"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, strokeWidth: 1, stroke: '#fff', fill: '#2563eb' }}
          />
          <Line
            type="monotone"
            dataKey="newCases"
            name="New Cases"
            stroke="#16a34a"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, strokeWidth: 1, stroke: '#fff', fill: '#16a34a' }}
          />
          <Line
            type="monotone"
            dataKey="deaths"
            name="Deaths"
            stroke="#dc2626"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, strokeWidth: 1, stroke: '#fff', fill: '#dc2626' }}
          />
        </>
      );
    }

    return selectedMetrics.map((metric) => {
      const metricConfig = {
        'Total Cases': { key: 'cases', color: '#2563eb' },
        'New Cases': { key: 'newCases', color: '#16a34a' },
        'Deaths': { key: 'deaths', color: '#dc2626' }
      }[metric];

      if (!metricConfig) return null;

      return (
        <Line
          key={metric}
          type="monotone"
          dataKey={metricConfig.key}
          name={metric}
          stroke={metricConfig.color}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 6, strokeWidth: 1, stroke: '#fff', fill: metricConfig.color }}
        />
      );
    });
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          dataKey="date"
          tickFormatter={formatXAxis}
          domain={['dataMin', 'dataMax']}
          tick={{ fill: '#666', fontSize: 12 }}
          tickLine={{ stroke: '#666' }}
          dy={10}
        />
        <YAxis 
          tick={{ fill: '#666', fontSize: 12 }}
          tickLine={{ stroke: '#666' }}
          width={80}
          tickFormatter={(value) => {
            if (value >= 1000000) {
              return `${(value / 1000000).toFixed(1)}M`;
            }
            if (value >= 1000) {
              return `${(value / 1000).toFixed(1)}K`;
            }
            return value;
          }}
        />
        <Tooltip 
          formatter={formatTooltip}
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            borderRadius: '8px',
            border: '1px solid #ddd',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            padding: '10px'
          }}
          labelStyle={{
            fontWeight: 'bold',
            marginBottom: '5px'
          }}
        />
        <Legend verticalAlign="top" height={36} />
        
        {renderLines()}
      </LineChart>
    </ResponsiveContainer>
  )
}

