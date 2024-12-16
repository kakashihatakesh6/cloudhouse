import { subMonths, format } from 'date-fns'

export interface DataPoint {
  date: string
  country: string
  cases: number
  deaths: number
  newCases: number
}

const countries = ['USA', 'India', 'Brazil', 'France', 'Germany', 'UK', 'Italy', 'Spain', 'Japan', 'Canada']

// Helper function to generate more realistic looking data
function generateRealisticData(baseNumber: number, monthIndex: number, variance: number = 0.1) {
  // Add some trend and seasonality
  const trend = monthIndex * (baseNumber * 0.05); // Upward trend
  const seasonality = Math.sin(monthIndex * Math.PI / 6) * baseNumber * 0.2; // Yearly seasonality
  const random = (Math.random() - 0.5) * baseNumber * variance; // Random variation
  
  return Math.max(0, Math.floor(baseNumber + trend + seasonality + random));
}

export function generateMockData(numMonths: number): DataPoint[] {
  const data: DataPoint[] = []
  const endDate = new Date()

  for (let i = numMonths - 1; i >= 0; i--) {
    const currentDate = subMonths(endDate, i)
    
    countries.forEach(country => {
      // Base numbers vary by country (example multipliers)
      const countryMultiplier = {
        'USA': 1.0,
        'India': 0.9,
        'Brazil': 0.7,
        'France': 0.4,
        'Germany': 0.4,
        'UK': 0.4,
        'Italy': 0.3,
        'Spain': 0.3,
        'Japan': 0.3,
        'Canada': 0.2
      }[country] || 0.5;

      const baseCases = 500000 * countryMultiplier;
      const baseDeaths = 5000 * countryMultiplier;
      const baseNewCases = 50000 * countryMultiplier;

      data.push({
        date: format(currentDate, 'yyyy-MM-dd'),
        country,
        cases: generateRealisticData(baseCases, i),
        deaths: generateRealisticData(baseDeaths, i),
        newCases: generateRealisticData(baseNewCases, i, 0.3)
      })
    })
  }

  return data
}

export const mockData = generateMockData(36) // 3 years of monthly data

