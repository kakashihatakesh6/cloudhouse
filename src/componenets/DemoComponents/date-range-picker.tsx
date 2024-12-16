'use client'

import React from 'react'
import { format } from 'date-fns'

interface DateRangePickerProps {
  dateRange: { from: Date; to: Date }
  setDateRange: (range: { from: Date; to: Date }) => void
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ dateRange, setDateRange }) => {
  return (
    <div className="flex flex-col space-y-2">
      <div>
        <label htmlFor="from-date" className="block text-sm font-medium text-gray-700">From</label>
        <input
          type="date"
          id="from-date"
          value={format(dateRange.from, 'yyyy-MM-dd')}
          onChange={(e) => setDateRange({ ...dateRange, from: new Date(e.target.value) })}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div>
        <label htmlFor="to-date" className="block text-sm font-medium text-gray-700">To</label>
        <input
          type="date"
          id="to-date"
          value={format(dateRange.to, 'yyyy-MM-dd')}
          onChange={(e) => setDateRange({ ...dateRange, to: new Date(e.target.value) })}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>
    </div>
  )
}

export default DateRangePicker

