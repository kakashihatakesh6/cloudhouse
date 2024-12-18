import { get } from "../lib/axios.interceptor"

interface PayloadInterface {
  id: number,
  time: string;
  country: string;
  metric: string;
  value: number;
}

export const getCovidData = async (payload: PayloadInterface) => {
  const response = await get(`covid/getfiltered/${payload.metric || payload.country || payload.time}`)
  return response?.data
}

// export const getOrganizationStatistics = async (organization_id: string) => {
//   const response = await get(`api/organizations/${organization_id}/statistics`)
//   return response?.data
// }
