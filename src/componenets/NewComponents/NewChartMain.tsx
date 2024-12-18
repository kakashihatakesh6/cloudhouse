import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import uPlot from 'uplot'
import 'uplot/dist/uPlot.min.css'

// Mock data for initial render
const MOCK_DATA = [
    { country: 'Brazil', id: 7, metric: 'Cases', time: '2020-01-01T00:00:00Z', value: 1200 },
    { country: 'Brazil', id: 8, metric: 'New Cases', time: '2020-01-01T00:00:00Z', value: 60 },
    { country: 'Brazil', id: 9, metric: 'Deaths', time: '2020-01-01T00:00:00Z', value: 15 }
]

const METRICS = ['Cases', 'New Cases', 'Deaths']
const COUNTRIES = ['Brazil', 'USA', 'India', 'UK', 'France']

export default function NewChartMain() {
    const chartRef = useRef<HTMLDivElement>(null)
    const [startDate, setStartDate] = useState('2020-01-01')
    const [endDate, setEndDate] = useState('2020-12-30')
    const [selectedCountry, setSelectedCountry] = useState('Brazil')
    const [selectedMetric, setSelectedMetric] = useState('Cases')
    const [data, setData] = useState(MOCK_DATA)
    const [error, setError] = useState('')
    const [refetch, setRefetch] = useState(false)
    console.log("data , metric, selected", data, selectedMetric, selectedCountry)

    const fetchData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_HOST}/api/covid/getdata`);
            if (!response) throw new Error('Failed to fetch data')
            const newData = await response.data;
            console.log("neww data =>", newData)
            if (newData.length === 0) {
                setError('No data available for the selected criteria.')
                setData([])
            } else {
                setData(newData)
                setError('')
                setRefetch(true)
            }
        } catch (err) {
            setError('Failed to fetch data. Showing mock data.')
            setData(MOCK_DATA)
        }
    }
    useEffect(() => {
        fetchData()
    }, [])


    useEffect(() => {
        const fetchFilterData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_HOST}/api/covid/getfiltered?metric=${selectedMetric}&country=${selectedCountry}&startDate=${startDate}&endDate=${endDate}`);
                if (!response) throw new Error('Failed to fetch data')
                const newData = await response.data;
                console.log("neww data =>", newData)
                if (newData.length === 0) {
                    setError('No data available for the selected criteria.')
                    setData([])
                } else {
                    setData(newData)
                    setError('')
                }
            } catch (err) {
                setError('Failed to fetch data. Showing mock data.')
                setData(MOCK_DATA)
            }
        }
        if (refetch) {
            fetchFilterData()
        }
    }, [startDate, endDate, selectedCountry, selectedMetric])

    useEffect(() => {
        if (!chartRef.current || !data.length) return

        // Clear previous chart
        chartRef.current.innerHTML = ''

        // Prepare data for uPlot
        const times = data.map(d => d.time ? new Date(d.time).getTime() / 1000 : null).filter(Boolean) as number[];
        const values = data.map(d => d.value != null ? d.value : null);

        if (times.length === 0 || values.every(v => v == null)) {
            chartRef.current.innerHTML = '<p>No valid data available for the selected criteria.</p>';
            return;
        }

        const opts = {
            title: `${selectedMetric} Over Time`,
            width: chartRef.current.clientWidth,
            height: 400,
            series: [
                {
                    label: 'Date',
                    value: (u: uPlot, v: number) => v ? new Date(v * 1000).toLocaleDateString() : ''
                },
                {
                    label: selectedMetric,
                    stroke: 'rgb(75, 192, 192)',
                    width: 2,
                    value: (u: uPlot, v: number) => v != null ? v.toLocaleString() : 'N/A'
                }
            ],
            scales: {
                x: {
                    time: true
                }
            },
            grid: {
                show: true,
                stroke: '#ddd'
            }
        }

        new uPlot(opts, [times, values], chartRef.current)
    }, [data, selectedMetric])

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium mb-1">Start Date</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">End Date</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Select Country</label>
                    <select
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        {data.map(item => (
                            <option key={item.id} value={item.country}>
                                {item.country}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Select Metric</label>
                    <select
                        value={selectedMetric}
                        onChange={(e) => setSelectedMetric(e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        {METRICS.map(metric => (
                            <option key={metric} value={metric}>
                                {metric}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div ref={chartRef} className="bg-white p-4 rounded border" />
        </div>
    )
}

