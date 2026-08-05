import axios from 'axios'
import { STORAGE_ROLE_KEY } from '@/features/auth/types'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api/v1'

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

apiClient.interceptors.request.use((config) => {
  const role = localStorage.getItem(STORAGE_ROLE_KEY)
  if (role) {
    config.headers['X-User-Role'] = role
  }
  // TODO: Attach JWT Bearer token when auth is implemented
  return config
})

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    // TODO: Global toast / redirect on 401/403
    return Promise.reject(error)
  },
)

export default apiClient
