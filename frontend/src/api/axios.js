import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  console.log('REQUEST HEADERS:', config.headers)
  return config
})

api.interceptors.response.use(
  res => res.data,
  err => {
    console.log('API Error:', err.response?.status, err.response?.data)
    if (err.response?.status === 401) {
      const token = localStorage.getItem('token')
      if (!token) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('userId')
        window.location.href = '/login'
      }
    }
    return Promise.reject(err.response?.data || err)
  }
)

export default api