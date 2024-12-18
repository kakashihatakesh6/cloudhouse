/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestHeaders, type AxiosResponse } from "axios"

let isIntercepting = false

interface MyApiError {
  code: string // Define the actual structure of the error response
  message: string
  // ... other properties if needed
}

const instance = axios.create({
  baseURL: process.env.REACT_PUBLIC_BASEURL,
  validateStatus: (status: number) => status < 400,
})

instance.interceptors.request.use(
  function (config: any) {
    // const token = storage.getToken()
    // if (token) {
    //   config.headers = {
    //     "Content-Type": "application/json",
    //     ...(config.headers || {}),
    //     Authorization: `Bearer ${token}`,
    //   } as AxiosRequestHeaders
    // }
    return config
  },
  function (error: Error) {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  function (response: AxiosResponse): AxiosResponse {
    isIntercepting = false
    return response
  },
  function (error: any) {
    console.log({ error })

    if (isIntercepting) {
      return Promise.reject(error)
    }
    // Set the flag to indicate interception
    isIntercepting = true
    // if (error?.response?.data?.message === 'Payment not found or expired') {
    //   window.location.href = '/home'
    // }
    if (error.response && error.response.status === 401) {
      // Redirect the user to the login page
      if (window.location.pathname !== "/auth/login") {
        window.location.href = "/not-authorized"
        // toast({
        //   title: "There was an Error",
        //   description: error?.response?.data?.error
        //     ? error?.response?.data?.error
        //     : error?.data?.error,
        //   variant: "destructive",
        // })
      }
    }
    if (error.response && error.response.status === 403) {
      if (window.location.pathname !== "/insufficient-permissions") {
        window.location.href = "/insufficient-permissions"
        // toast({
        //   title: "Insufficient Permissions",
        //   description: error?.response?.data?.error
        //     ? error?.response?.data?.error
        //     : error?.data?.error,
        //   variant: "destructive",
        // })
      }
    }
    if (error?.response) {
      const apiError = error?.response?.data as MyApiError
      console.log("---error", apiError.code)
      // toast({
      //   title: 'There was an Error',
      //   description: error?.response?.data?.message,
      // })
      return Promise.reject(error.response)
    }

    // toast({
    //   title: "We Experienced an Error",
    //   variant: "destructive",

    //   description: error?.message
    //     ? error?.message
    //     : error?.response?.data?.error
    //     ? error?.response?.data?.error
    //     : error?.data?.error,
    // })
    return Promise.reject(error)
  }
)

export const get = async (path: string) => {
  const response = await instance.get(path)

  return response
}

export const post = async (path: string, body?: any) => {
  const response = await instance.post(path, body)
  return response
}

export const put = async (path: string, body: any) => {
  const response = await instance.put(path, body)
  return response
}

export const patch = async (path: string, body?: any) => {
  const response = await instance.patch(path, body)
  return response
}

export const deletes = async (path: string) => {
  const response = await instance.delete(path)
  return response
}
