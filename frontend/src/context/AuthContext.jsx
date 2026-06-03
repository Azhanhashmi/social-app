import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if (token && savedUser) {
      try { setUser(JSON.parse(savedUser)) } catch {}
    }
    setLoading(false)
  }, [])

 const login = async (email, password) => {
  const res = await authAPI.login({ email, password })
  const token = res.token || res.data?.token
  const user = res.user || res.data?.user || res.data
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
  localStorage.setItem('userId', user._id || user.id)
  setUser(user)
  return user
}

const signup = async (username, email, password) => {
  const res = await authAPI.signup({ username, email, password })
  const token = res.token || res.data?.token
  const user = res.user || res.data?.user || res.data
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
  localStorage.setItem('userId', user._id || user.id)
  setUser(user)
  return user
}

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('userId')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)