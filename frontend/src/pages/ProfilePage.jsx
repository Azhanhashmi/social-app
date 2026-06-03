import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Avatar, Typography, Button, Tab, Tabs, IconButton } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import PostCard from '../components/PostCard'
import BottomNav from '../components/BottomNav'
import { ProfileSkeleton, PostSkeleton } from '../components/Skeletons'
import { mockPosts } from '../api/mockData'
import { useAuth } from '../context/AuthContext'

export default function ProfilePage() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const [profileUser, setProfileUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [tab, setTab] = useState(0)

  useEffect(() => {
    if (!currentUser) { navigate('/login'); return }
    const targetId = userId || currentUser._id
    loadProfile(targetId)
    loadUserPosts(targetId)
  }, [userId, currentUser])

  const loadProfile = async (id) => {
    setLoadingProfile(true)
    try {
      const user = await mockPosts.getUser(id)
      setProfileUser(user)
    } finally {
      setLoadingProfile(false)
    }
  }

  const loadUserPosts = async (id) => {
    setLoadingPosts(true)
    try {
      const data = await mockPosts.getUserPosts(id)
      setPosts(data)
    } finally {
      setLoadingPosts(false)
    }
  }

  const joinDate = profileUser?.createdAt
    ? new Date(profileUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : ''

  const isOwnProfile = currentUser?._id === (userId || currentUser?._id)

  return (
    <Box sx={{ minHeight: '100vh', background: '#f0f2f5', pb: 10 }}>
      <Box sx={{ background: 'white', boxShadow: '0 1px 8px rgba(0,0,0,0.08)', px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1, position: 'sticky', top: 0, zIndex: 100 }}>
        <IconButton onClick={() => navigate(-1)} size="small">
          <ArrowBackIcon />
        </IconButton>
        <Typography fontWeight={800} fontSize={18} flex={1}>{profileUser?.username || 'Profile'}</Typography>
      </Box>

      {loadingProfile ? <ProfileSkeleton /> : (
        <>
          <Box sx={{ background: 'linear-gradient(135deg, #1976d2, #42a5f5)', height: 120, position: 'relative' }}>
            <Box sx={{ position: 'absolute', bottom: -44, left: '50%', transform: 'translateX(-50%)' }}>
              <Avatar src={profileUser?.profileImage || ''}
                sx={{ width: 88, height: 88, border: '4px solid white', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }} />
            </Box>
          </Box>

          <Box sx={{ background: 'white', pt: 7, pb: 3, px: 2, textAlign: 'center', mb: 1 }}>
            <Typography fontWeight={800} fontSize={20}>{profileUser?.username}</Typography>
            <Typography color="text.secondary" fontSize={14} mt={0.3}>@{profileUser?.username}</Typography>

            {joinDate && (
              <Box display="flex" alignItems="center" justifyContent="center" gap={0.5} mt={1} mb={2}>
                <CalendarTodayOutlinedIcon sx={{ fontSize: 14, color: '#9e9e9e' }} />
                <Typography fontSize={13} color="text.secondary">Joined {joinDate}</Typography>
              </Box>
            )}

            <Box display="flex" justifyContent="center" gap={0} sx={{ borderTop: '1px solid #f0f2f5', pt: 2 }}>
              {[
                { label: 'Posts', value: posts.length },
                { label: 'Followers', value: 0 },
                { label: 'Following', value: 0 },
              ].map((stat, i) => (
                <Box key={stat.label} flex={1} textAlign="center"
                  sx={{ borderRight: i < 2 ? '1px solid #f0f2f5' : 'none' }}>
                  <Typography fontWeight={800} fontSize={20} color="primary">{stat.value}</Typography>
                  <Typography fontSize={12} color="text.secondary" fontWeight={600}>{stat.label}</Typography>
                </Box>
              ))}
            </Box>

            <Box mt={2}>
              {isOwnProfile
                ? <Button variant="outlined" sx={{ borderRadius: 24, px: 3, fontWeight: 700, fontSize: 13 }}>Edit Profile</Button>
                : <Box display="flex" gap={1} justifyContent="center">
                    <Button variant="contained" sx={{ borderRadius: 24, px: 3, fontWeight: 700, boxShadow: 'none' }}>Follow</Button>
                    <Button variant="outlined" sx={{ borderRadius: 24, px: 3, fontWeight: 700, fontSize: 13 }}>Message</Button>
                  </Box>
              }
            </Box>
          </Box>

          <Box sx={{ background: 'white', mb: 1 }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth"
              sx={{ '& .MuiTab-root': { fontWeight: 700, fontSize: 13 }, '& .MuiTabs-indicator': { height: 3, borderRadius: 2 } }}>
              <Tab label="Posts" />
              <Tab label="Liked" />
              <Tab label="Commented" />
            </Tabs>
          </Box>
        </>
      )}

      <Box sx={{ px: 1.5 }}>
        {loadingPosts
          ? [1, 2].map(i => <PostSkeleton key={i} />)
          : tab === 0
            ? posts.map(post => <PostCard key={post._id} post={post} currentUser={currentUser} />)
            : <Box textAlign="center" py={5}><Typography color="text.secondary">No posts here yet</Typography></Box>
        }
        {!loadingPosts && tab === 0 && posts.length === 0 && (
          <Box textAlign="center" py={6}>
            <Typography color="text.secondary">No posts yet</Typography>
          </Box>
        )}
      </Box>

      <BottomNav userId={currentUser?._id} />
    </Box>
  )
}