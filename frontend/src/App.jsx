import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { SnackbarProvider } from 'notistack'
import { AuthProvider, useAuth } from './context/AuthContext'
import { PostProvider } from './context/PostContext'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import FeedPage from './pages/FeedPage'
import ProfilePage from './pages/ProfilePage'

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2', light: '#e3f2fd', dark: '#1565c0' },
    background: { default: '#f0f2f5' },
  },
  typography: {
    fontFamily: '"Nunito", sans-serif',
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 700, borderRadius: 24 },
      },
    },
  },
})

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return !user ? children : <Navigate to="/feed" replace />
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={2500}>
        <AuthProvider>
          <PostProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
                <Route path="/feed" element={<ProtectedRoute><FeedPage /></ProtectedRoute>} />
                <Route path="/profile/:userId?" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/feed" replace />} />
              </Routes>
            </BrowserRouter>
          </PostProvider>
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  )
}
