import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSnackbar } from 'notistack'
import { TextField, Button, Typography, Box, CircularProgress, InputAdornment, IconButton } from '@mui/material'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import GroupsIcon from '@mui/icons-material/Groups'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) { enqueueSnackbar('Please fill all fields', { variant: 'warning' }); return }
    setLoading(true)
    try {
      await login(email, password)
      enqueueSnackbar('Login successful! 🎉', { variant: 'success' })
      navigate('/feed')
    } catch (err) {
      enqueueSnackbar(err.message || 'Invalid credentials', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          <Box sx={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #1976d2, #42a5f5)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5, boxShadow: '0 4px 16px rgba(25,118,210,0.3)' }}>
            <GroupsIcon sx={{ color: 'white', fontSize: 34 }} />
          </Box>
          <Typography variant="h5" fontWeight={800} color="primary">SocialHub</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>Connect, share & inspire</Typography>
        </Box>

        <Typography variant="h6" fontWeight={700} mb={2.5}>Welcome back 👋</Typography>

        <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField fullWidth label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><EmailOutlinedIcon color="action" /></InputAdornment> }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />

          <TextField fullWidth label="Password" type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><LockOutlinedIcon color="action" /></InputAdornment>,
              endAdornment: <InputAdornment position="end">
                <IconButton onClick={() => setShowPass(!showPass)} edge="end">
                  {showPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />

          <Button type="submit" variant="contained" fullWidth disabled={loading} size="large"
            sx={{ py: 1.5, fontSize: 16, fontWeight: 800, boxShadow: '0 4px 14px rgba(25,118,210,0.4)' }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>
        </Box>

        <Box mt={3} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#1976d2', fontWeight: 700, textDecoration: 'none' }}>Sign up</Link>
          </Typography>
        </Box>
      </div>
    </div>
  )
}