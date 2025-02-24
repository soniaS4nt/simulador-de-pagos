import axios, { AxiosInstance, isAxiosError } from 'axios'

export interface AxiosConfig {
  baseURL: BaseURL
}

export type BaseURL = 'API_NEST' | 'API_NEXT'

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.host}`
  }
  return `http://localhost:${process.env.PORT || '3000'}`
}

const baseUrlDic: { [key in BaseURL]: string } = {
  'API_NEST': 'http://localhost:4000',
  'API_NEXT': getBaseUrl(),
}

const getAxiosInstance = ({ baseURL }: AxiosConfig): AxiosInstance => {
  const axiosInstance = axios.create({
    baseURL: baseUrlDic[baseURL],
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return axiosInstance
}

export { getAxiosInstance, isAxiosError }