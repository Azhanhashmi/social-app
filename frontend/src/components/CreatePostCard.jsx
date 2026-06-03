import React, { useState, useRef } from 'react'
import { Box, Avatar, TextField, Button, IconButton, Typography, CircularProgress } from '@mui/material'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt'
import SendIcon from '@mui/icons-material/Send'
import CloseIcon from '@mui/icons-material/Close'
import { mockPosts } from '../api/mockData'
import { useSnackbar } from 'notistack'

export default function CreatePostCard({ currentUser, onPostCreated }) {
  const [text, setText] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const fileRef = useRef()
  const { enqueueSnackbar } = useSnackbar()

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  const handlePost = async () => {
    if (!text.trim() && !imageFile) {
      enqueueSnackbar('Add some text or image to post', { variant: 'warning' })
      return
    }
    setLoading(true)
    try {
      const post = await mockPosts.createPost({ text: text.trim(), imageFile })
      setText('')
      removeImage()
      enqueueSnackbar('Post created! 🎉', { variant: 'success' })
      onPostCreated && onPostCreated(post)
    } catch (err) {
      enqueueSnackbar(err.message || 'Something went wrong', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ background: '#fff', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', mb: 1.5, overflow: 'hidden' }}>
      <Box sx={{ px: 2, pt: 2, pb: 1 }}>
        <Typography fontWeight={800} fontSize={17} mb={1.5}>Create Post</Typography>
        <Box display="flex" gap={1.5} alignItems="flex-start">
          <Avatar src={currentUser?.profileImage || currentUser?.avatar} sx={{ width: 40, height: 40, mt: 0.5 }} />
          <TextField fullWidth multiline minRows={2} maxRows={5} placeholder="What's on your mind?"
            value={text} onChange={e => setText(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { background: '#f8f9fa', borderRadius: 3, fontSize: 15, '& fieldset': { border: 'none' } } }} />
        </Box>
      </Box>

      {imagePreview && (
        <Box sx={{ px: 2, pt: 1, position: 'relative' }}>
          <img src={imagePreview} alt="preview" style={{ width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 12 }} />
          <IconButton onClick={removeImage} size="small"
            sx={{ position: 'absolute', top: 12, right: 20, background: 'rgba(0,0,0,0.6)', color: 'white' }}>
            <CloseIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.5 }}>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleImageChange} />
        <IconButton onClick={() => fileRef.current?.click()} size="small" sx={{ color: '#536471', mr: 0.5 }}>
          <ImageOutlinedIcon />
        </IconButton>
        <IconButton size="small" sx={{ color: '#536471' }}>
          <SentimentSatisfiedAltIcon />
        </IconButton>
        <Box flex={1} />
        <Button variant="contained" onClick={handlePost} disabled={loading || (!text.trim() && !imageFile)}
          endIcon={loading ? <CircularProgress size={14} color="inherit" /> : <SendIcon sx={{ fontSize: 16 }} />}
          sx={{ borderRadius: 24, px: 2.5, py: 0.75, fontSize: 14, fontWeight: 700, boxShadow: 'none' }}>
          Post
        </Button>
      </Box>
    </Box>
  )
}