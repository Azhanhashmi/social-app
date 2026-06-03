import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Avatar, IconButton, TextField, InputAdornment, Chip, Fab, Badge } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import AddIcon from '@mui/icons-material/Add'
import NotificationsIcon from '@mui/icons-material/Notifications'
import StarIcon from '@mui/icons-material/Star'
import PostCard from '../components/PostCard'
import CreatePostCard from '../components/CreatePostCard'
import CreatePostModal from '../components/CreatePostModal'
import BottomNav from '../components/BottomNav'
import { PostSkeleton } from '../components/Skeletons'
import { mockPosts } from '../api/mockData'

const FILTERS = [
  { key: 'all', label: 'All Post' },
  { key: 'for_you', label: 'For You' },
  { key: 'most_liked', label: 'Most Liked' },
  { key: 'most_commented', label: 'Most Commented' },
  { key: 'most_shared', label: 'Most Shared' },
]

export default function FeedPage() {
  const [currentUser, setCurrentUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [fabModalOpen, setFabModalOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const saved = localStorage.getItem('user')
    if (saved) {
      try { setCurrentUser(JSON.parse(saved)) } catch {}
    } else {
      navigate('/login')
    }
  }, [])

  const loadPosts = useCallback(async (f = filter) => {
    setLoading(true)
    try {
      const data = await mockPosts.getPosts({ filter: f })
      setPosts(data)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => { loadPosts(filter) }, [filter])

  const handleFilterChange = (key) => {
    setFilter(key)
    loadPosts(key)
  }

  const handlePostCreated = (post) => {
    setPosts(prev => [post, ...prev])
  }

  const filteredPosts = search
    ? posts.filter(p => p.text?.toLowerCase().includes(search.toLowerCase()) || p.user?.username?.toLowerCase().includes(search.toLowerCase()))
    : posts

  return (
    <Box sx={{ minHeight: '100vh', background: '#f0f2f5', pb: 10 }}>
      {/* Top Header */}
      <Box sx={{
        position: 'sticky', top: 0, zIndex: 100, background: 'white',
        px: 2, py: 1.5,
        boxShadow: '0 1px 8px rgba(0,0,0,0.08)',
      }}>
        {/* Row 1: Title + stats + avatar */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
          <Typography fontWeight={900} fontSize={24} letterSpacing={-0.5}>Social</Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Box sx={{ display: 'flex', alignItems: 'center', background: '#fff9e6', border: '1px solid #ffe082', borderRadius: 24, px: 1.5, py: 0.5, gap: 0.5 }}>
              <StarIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
              <Typography fontSize={13} fontWeight={700} color="#f59e0b">50</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', background: '#e8f5e9', border: '1px solid #a5d6a7', borderRadius: 24, px: 1.5, py: 0.5 }}>
              <Typography fontSize={13} fontWeight={700} color="#2e7d32">₹0.00</Typography>
            </Box>
            <IconButton size="small" sx={{ p: 0.5 }}>
              <Badge badgeContent={1} color="error">
                <NotificationsNoneIcon sx={{ fontSize: 24, color: '#536471' }} />
              </Badge>
            </IconButton>
            <Avatar src={currentUser?.avatar} sx={{ width: 36, height: 36, cursor: 'pointer', border: '2px solid #1976d2' }}
              onClick={() => navigate(`/profile/${currentUser?._id}`)} />
          </Box>
        </Box>

        {/* Row 2: Search bar */}
        <Box display="flex" alignItems="center" gap={1}>
          <TextField fullWidth size="small" placeholder="Search users or posts..."
            value={search} onChange={e => setSearch(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 24, fontSize: 14, background: '#f0f2f5', '& fieldset': { border: 'none' } } }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#9e9e9e', fontSize: 20 }} /></InputAdornment> }}
          />
          <Box sx={{ width: 40, height: 40, borderRadius: '50%', background: '#1976d2', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <SearchIcon sx={{ color: 'white', fontSize: 20 }} />
          </Box>
        </Box>
      </Box>

      {/* Feed content */}
      <Box sx={{ px: 1.5, pt: 1.5 }}>
        {/* Create Post Card */}
        <CreatePostCard currentUser={currentUser} onPostCreated={handlePostCreated} activeFilter={filter} onFilterChange={handleFilterChange} />

        {/* Filter chips */}
        <Box className="filter-chips" sx={{ mb: 1.5 }}>
          {FILTERS.map(f => (
            <Chip key={f.key} label={f.label} onClick={() => handleFilterChange(f.key)}
              sx={{
                background: filter === f.key ? '#1976d2' : 'white',
                color: filter === f.key ? 'white' : '#536471',
                fontWeight: filter === f.key ? 700 : 600,
                fontSize: 13,
                height: 34,
                border: filter === f.key ? 'none' : '1px solid #e0e0e0',
                boxShadow: filter === f.key ? '0 2px 8px rgba(25,118,210,0.3)' : 'none',
                flexShrink: 0,
                '&:hover': { background: filter === f.key ? '#1565c0' : '#f5f5f5' },
              }} />
          ))}
        </Box>

        {/* Posts */}
        {loading
          ? [1,2,3].map(i => <PostSkeleton key={i} />)
          : filteredPosts.map(post => (
            <PostCard key={post._id} post={post} currentUser={currentUser}
              onLike={(id, liked, count) => setPosts(prev => prev.map(p => p._id === id ? { ...p, liked, likesCount: count } : p))}
              onComment={(id, comment) => setPosts(prev => prev.map(p => p._id === id ? { ...p, commentsCount: p.commentsCount + 1 } : p))}
            />
          ))
        }

        {!loading && filteredPosts.length === 0 && (
          <Box textAlign="center" py={6}>
            <Typography color="text.secondary" fontSize={15}>No posts found</Typography>
          </Box>
        )}
      </Box>

      {/* FAB */}
      <Fab color="primary" onClick={() => setFabModalOpen(true)}
        sx={{ position: 'fixed', bottom: 80, right: 16, boxShadow: '0 4px 16px rgba(25,118,210,0.4)', zIndex: 200 }}>
        <AddIcon />
      </Fab>

      {/* FAB Modal */}
      <CreatePostModal open={fabModalOpen} onClose={() => setFabModalOpen(false)}
        currentUser={currentUser} onPostCreated={handlePostCreated} />

      {/* Bottom Nav */}
      <BottomNav userId={currentUser?._id} />
    </Box>
  )
}
