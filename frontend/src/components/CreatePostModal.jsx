import React, { useState, useRef } from 'react'
import { Dialog, DialogTitle, DialogContent, Box, Avatar, TextField, Button, IconButton, Typography, CircularProgress } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import SendIcon from '@mui/icons-material/Send'
import { mockPosts } from '../api/mockData'
import { useSnackbar } from 'notistack'

export default function CreatePostModal({ open, onClose, currentUser, onPostCreated }) {
  const [text, setText] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const fileRef = useRef()
  const { enqueueSnackbar } = useSnackbar()

  const handleImage = (e) => {
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
      enqueueSnackbar('Add text or image', { variant: 'warning' }); return
    }
    setLoading(true)
    try {
      const post = await mockPosts.createPost({ text: text.trim(), imageFile })
      setText('')
      removeImage()
      enqueueSnackbar('Post created! 🎉', { variant: 'success' })
      onPostCreated && onPostCreated(post)
      onClose()
    } catch (err) {
      enqueueSnackbar(err.message || 'Something went wrong', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm"
      PaperProps={{ sx: { borderRadius: '20px', mx: 2, position: 'fixed', bottom: 80, top: 'auto', m: 0, width: 'calc(100% - 32px)', maxWidth: 448 } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Typography fontWeight={800} fontSize={17}>Create Post</Typography>
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 0 }}>
        <Box display="flex" gap={1.5} mb={2}>
          <Avatar src={currentUser?.profileImage || currentUser?.avatar} sx={{ width: 42, height: 42 }} />
          <Box flex={1}>
            <Typography fontWeight={700} fontSize={14}>{currentUser?.username}</Typography>
            <Typography fontSize={12} color="text.secondary">@{currentUser?.username}</Typography>
          </Box>
        </Box>

        <TextField fullWidth multiline minRows={3} maxRows={6} placeholder="What's on your mind?"
          value={text} onChange={e => setText(e.target.value)}
          sx={{ mb: 1.5, '& .MuiOutlinedInput-root': { borderRadius: 3, fontSize: 15, background: '#f8f9fa', '& fieldset': { border: 'none' } } }} />

        {imagePreview && (
          <Box sx={{ position: 'relative', mb: 1.5 }}>
            <img src={imagePreview} alt="preview" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 12 }} />
            <IconButton onClick={removeImage} size="small"
              sx={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', color: 'white' }}>
              <CloseIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        )}

        <Box display="flex" alignItems="center" gap={1}>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleImage} />
          <Button startIcon={<ImageOutlinedIcon />} onClick={() => fileRef.current?.click()}
            sx={{ borderRadius: 24, color: '#536471', fontWeight: 600, fontSize: 13 }}>
            Photo
          </Button>
          <Box flex={1} />
          <Button variant="contained" onClick={handlePost} disabled={loading || (!text.trim() && !imageFile)}
            endIcon={loading ? <CircularProgress size={14} color="inherit" /> : <SendIcon sx={{ fontSize: 15 }} />}
            sx={{ borderRadius: 24, px: 3, fontWeight: 700, boxShadow: 'none' }}>
            Post
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}