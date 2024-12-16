/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import uPlot from 'uplot';
import 'uplot/dist/uPlot.min.css';

const Chart = ({ data, metric }) => {
  const chartRef = useRef(null);
  const [uPlotInstance, setUPlotInstance] = useState(null);

  useEffect(() => {
    if (!Array.isArray(data) || data.length === 0 || !chartRef.current) return;

    const countries = [...new Set(data.map((d) => d.country))];

    const series = [
      { label: 'Date', value: (u, v) => new Date(v * 1000).toLocaleDateString() },
      ...countries.map((country) => ({
        label: country,
        stroke: getRandomColor(),
        value: (u, v) => (v != null ? v.toFixed(2) : '-'),
      })),
    ];

    const timestamps = [...new Set(data.map((d) => new Date(d.timestamp).getTime() / 1000))].sort();
    const plotData = [
      timestamps,
      ...countries.map((country) =>
        timestamps.map((t) =>
          data.find((d) => d.country === country && new Date(d.timestamp).getTime() / 1000 === t)?.[metric] ?? null
        )
      ),
    ];

    const opts = {
      width: chartRef.current.clientWidth,
      height: 400,
      title: `COVID-19 ${metric.replace('_', ' ').toUpperCase()}`,
      series,
      scales: { x: { time: true }, y: { auto: true } },
      axes: [
        { scale: 'x', label: 'Date' },
        { scale: 'y', label: metric.replace('_', ' ').toUpperCase() },
      ],
      hooks: {
        setCursor: [
          (u) => {
            const { left, top, idx } = u.cursor;
            const tooltip = document.getElementById('uplot-tooltip');
            if (!tooltip || idx == null) return;
            const date = new Date(u.data[0][idx] * 1000).toLocaleDateString();
            tooltip.innerHTML = `<strong>${date}</strong>`;
            tooltip.style.left = `${left + 15}px`;
            tooltip.style.top = `${top + 15}px`;
          },
        ],
      },
    };

    const newUPlotInstance = new uPlot(opts, plotData, chartRef.current);
    setUPlotInstance(newUPlotInstance);

    const resizeObserver = new ResizeObserver(() => {
      newUPlotInstance.setSize({ width: chartRef.current.clientWidth, height: 400 });
    });

    resizeObserver.observe(chartRef.current);

    return () => {
      newUPlotInstance.destroy();
      resizeObserver.disconnect();
    };
  }, [data, metric]);

  return <div ref={chartRef} style={{ width: '100%', maxWidth: '800px', height: '400px', margin: '0 auto' }}></div>;
};

function getRandomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
}

export default Chart;
