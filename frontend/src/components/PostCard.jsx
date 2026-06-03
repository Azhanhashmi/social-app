import React, { useState } from 'react'
import { Avatar, Box, Typography, IconButton, TextField, Button, Collapse } from '@mui/material'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import SendIcon from '@mui/icons-material/Send'
import { mockPosts } from '../api/mockData'
import { useSnackbar } from 'notistack'

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function PostCard({ post, currentUser, onLike, onComment }) {
  const [liked, setLiked] = useState(post.liked || false)
  const [likesCount, setLikesCount] = useState(post.likesCount || 0)
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState(post.comments || [])
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0)
  const [likeAnimating, setLikeAnimating] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  const handleLike = async () => {
    if (!currentUser) { enqueueSnackbar('Login to like posts', { variant: 'warning' }); return }
    const newLiked = !liked
    const newCount = newLiked ? likesCount + 1 : likesCount - 1
    setLiked(newLiked)
    setLikesCount(newCount)
    setLikeAnimating(true)
    setTimeout(() => setLikeAnimating(false), 300)
    try {
      await mockPosts.likePost(post._id)
      onLike && onLike(post._id, newLiked, newCount)
    } catch {
      setLiked(!newLiked)
      setLikesCount(likesCount)
    }
  }

  const handleComment = async () => {
    if (!currentUser) { enqueueSnackbar('Login to comment', { variant: 'warning' }); return }
    if (!commentText.trim()) return
    setSubmitting(true)
    try {
      const comment = await mockPosts.commentPost(post._id, commentText)
      setComments(prev => [...prev, comment])
      setCommentsCount(c => c + 1)
      setCommentText('')
      enqueueSnackbar('Comment added', { variant: 'success' })
      onComment && onComment(post._id, comment)
    } catch {
      enqueueSnackbar('Something went wrong', { variant: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box sx={{ background: '#fff', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', mb: 1.5, overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', p: 2, pb: 1.5 }}>
        <Avatar src={post.user?.avatar} sx={{ width: 46, height: 46, mr: 1.5, border: '2px solid #e3f2fd' }} />
        <Box flex={1}>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Typography fontWeight={800} fontSize={15} lineHeight={1.2}>{post.user?.username}</Typography>
            <Typography color="text.secondary" fontSize={13}>@{post.user?.handle || post.user?.username}</Typography>
          </Box>
          <Typography color="text.secondary" fontSize={12} mt={0.2}>{timeAgo(post.createdAt)}</Typography>
        </Box>
        {currentUser?._id !== post.user?._id && (
          <Button variant="contained" size="small"
            sx={{ borderRadius: 24, px: 2, py: 0.5, fontSize: 13, fontWeight: 700, minWidth: 'auto', boxShadow: 'none' }}>
            Follow
          </Button>
        )}
      </Box>

      {post.text && (
        <Box sx={{ px: 2, pb: post.image ? 1.5 : 0 }}>
          <Typography fontSize={15} lineHeight={1.6} sx={{ wordBreak: 'break-word' }}>{post.text}</Typography>
        </Box>
      )}

      {post.image && (
        <Box sx={{ px: 2, pb: 1.5 }}>
          <img src={post.image} alt="post" style={{ width: '100%', borderRadius: 12, maxHeight: 280, objectFit: 'cover' }} />
        </Box>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', px: 1.5, py: 1, borderTop: '1px solid #f0f2f5' }}>
        <Box display="flex" alignItems="center" mr={2}>
          <IconButton onClick={handleLike} size="small"
            className={likeAnimating ? 'like-blip' : ''}
            sx={{ color: liked ? '#e91e63' : '#536471', p: 0.75 }}>
            {liked ? <FavoriteIcon sx={{ fontSize: 22 }} /> : <FavoriteBorderIcon sx={{ fontSize: 22 }} />}
          </IconButton>
          <Typography fontSize={13} fontWeight={600} color={liked ? '#e91e63' : 'text.secondary'} ml={0.5}>{likesCount}</Typography>
        </Box>

        <Box display="flex" alignItems="center" mr={2}>
          <IconButton onClick={() => setShowComments(!showComments)} size="small"
            sx={{ color: showComments ? '#1976d2' : '#536471', p: 0.75 }}>
            <ChatBubbleOutlineIcon sx={{ fontSize: 21 }} />
          </IconButton>
          <Typography fontSize={13} fontWeight={600} color={showComments ? '#1976d2' : 'text.secondary'} ml={0.5}>{commentsCount}</Typography>
        </Box>

        <Box display="flex" alignItems="center">
          <IconButton size="small" sx={{ color: '#536471', p: 0.75 }}>
            <ShareOutlinedIcon sx={{ fontSize: 21 }} />
          </IconButton>
        </Box>
      </Box>

      <Collapse in={showComments}>
        <Box sx={{ borderTop: '1px solid #f0f2f5', px: 2, py: 1.5 }}>
          {comments.map((comment, i) => (
            <Box key={comment._id || i} display="flex" gap={1} mb={1.5}>
              <Avatar src={comment.user?.avatar} sx={{ width: 32, height: 32, flexShrink: 0 }} />
              <Box sx={{ background: '#f0f2f5', borderRadius: '12px', px: 1.5, py: 1, flex: 1 }}>
                <Typography fontSize={13} fontWeight={700}>{comment.user?.username || comment.username}</Typography>
                <Typography fontSize={13} lineHeight={1.5}>{comment.text}</Typography>
                <Typography fontSize={11} color="text.secondary" mt={0.3}>{timeAgo(comment.createdAt)}</Typography>
              </Box>
            </Box>
          ))}

          <Box display="flex" gap={1} alignItems="center" mt={1}>
            <Avatar src={currentUser?.avatar || currentUser?.profileImage} sx={{ width: 32, height: 32, flexShrink: 0 }} />
            <TextField fullWidth size="small" placeholder="Add a comment..." value={commentText}
              onChange={e => setCommentText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleComment()}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 24, fontSize: 13, background: '#f0f2f5', '& fieldset': { border: 'none' } } }}
            />
            <IconButton onClick={handleComment} disabled={!commentText.trim() || submitting}
              sx={{ background: '#1976d2', color: 'white', width: 36, height: 36, '&:hover': { background: '#1565c0' }, '&:disabled': { background: '#e0e0e0' } }}>
              <SendIcon sx={{ fontSize: 17 }} />
            </IconButton>
          </Box>
        </Box>
      </Collapse>
    </Box>
  )
}