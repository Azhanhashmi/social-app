import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import PersonIcon from '@mui/icons-material/Person'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined'
import ChatIcon from '@mui/icons-material/Chat'
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined'

const tabs = [
  { label: 'Home', path: '/', activeIcon: <HomeIcon />, inactiveIcon: <HomeOutlinedIcon /> },
  { label: 'Social', path: '/feed', activeIcon: <PeopleAltIcon />, inactiveIcon: <PeopleAltOutlinedIcon /> },
  { label: 'Profile', path: '/profile', activeIcon: <PersonIcon />, inactiveIcon: <PersonOutlineIcon /> },
  { label: 'Leaders', path: '/leaders', activeIcon: <EmojiEventsIcon />, inactiveIcon: <EmojiEventsOutlinedIcon /> },
  { label: 'Chat', path: '/chat', activeIcon: <ChatIcon />, inactiveIcon: <ChatOutlinedIcon /> },
]

export default function BottomNav({ userId }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const getActive = (path) => {
    if (path === '/feed') return pathname === '/feed'
    if (path === '/profile') return pathname.startsWith('/profile')
    return false
  }

  const handleNav = (path) => {
    if (path === '/feed') navigate('/feed')
    else if (path === '/profile') navigate(`/profile/${userId || ''}`)
    // Other tabs: no-op for demo
  }

  return (
    <Box sx={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 480,
      background: '#1976d2',
      display: 'flex', alignItems: 'center',
      height: 64, zIndex: 1000,
      boxShadow: '0 -2px 20px rgba(25,118,210,0.25)',
    }}>
      {tabs.map(tab => {
        const active = getActive(tab.path)
        return (
          <Box key={tab.label} onClick={() => handleNav(tab.path)}
            sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', py: 0.5, position: 'relative' }}>
            {active && (
              <Box sx={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 44, height: 44, background: 'rgba(255,255,255,0.2)', borderRadius: '50%', mt: 0.5 }} />
            )}
            <Box sx={{ color: 'white', position: 'relative', '& svg': { fontSize: 24 } }}>
              {active ? tab.activeIcon : tab.inactiveIcon}
            </Box>
            <Typography fontSize={11} fontWeight={active ? 700 : 500} sx={{ color: 'white', mt: 0.2 }}>
              {tab.label}
            </Typography>
          </Box>
        )
      })}
    </Box>
  )
}
