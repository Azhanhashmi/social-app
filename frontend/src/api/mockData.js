import api from './axios'

const FAKE_POSTS = [
  {
    _id: 'fake_1',
    text: '🌅 Just watched the most beautiful sunrise this morning. Sometimes you just need to slow down and appreciate the little things in life. Grateful for days like these! ✨',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    likesCount: 42,
    commentsCount: 7,
    liked: false,
    comments: [],
    user: { _id: 'fake_user_1', username: 'Sarah Mitchell', handle: 'sarahmitchell', avatar: 'https://i.pravatar.cc/150?img=47' },
    author: { _id: 'fake_user_1', username: 'Sarah Mitchell', profileImage: 'https://i.pravatar.cc/150?img=47' },
  },
  {
    _id: 'fake_2',
    text: '🚀 Just shipped my first open-source project! Months of late nights finally paid off. If you\'re learning to code — keep going, it\'s absolutely worth it. Drop a ⭐ if you want the repo link!',
    image: '',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    likesCount: 128,
    commentsCount: 34,
    liked: false,
    comments: [],
    user: { _id: 'fake_user_2', username: 'Alex Chen', handle: 'alexchen_dev', avatar: 'https://i.pravatar.cc/150?img=12' },
    author: { _id: 'fake_user_2', username: 'Alex Chen', profileImage: 'https://i.pravatar.cc/150?img=12' },
  },
  {
    _id: 'fake_3',
    text: '🍕 Tried making homemade pizza from scratch today. The dough was a disaster at first but the end result was actually fire 🔥 Recipe in comments!',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    likesCount: 89,
    commentsCount: 21,
    liked: false,
    comments: [],
    user: { _id: 'fake_user_3', username: 'Jamie Oliver Jr', handle: 'jamiecooks', avatar: 'https://i.pravatar.cc/150?img=33' },
    author: { _id: 'fake_user_3', username: 'Jamie Oliver Jr', profileImage: 'https://i.pravatar.cc/150?img=33' },
  },
  {
    _id: 'fake_4',
    text: '💪 30 days of working out consistently. The results are not just physical — my mental health has improved so much. Starting is the hardest part. You got this! 🙌',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    likesCount: 203,
    commentsCount: 45,
    liked: false,
    comments: [],
    user: { _id: 'fake_user_4', username: 'Marcus Fit', handle: 'marcusfit', avatar: 'https://i.pravatar.cc/150?img=68' },
    author: { _id: 'fake_user_4', username: 'Marcus Fit', profileImage: 'https://i.pravatar.cc/150?img=68' },
  },
]

export const mockPosts = {
 getPosts: async ({ filter = 'all', page = 1, limit = 20 } = {}) => {
  try {
    const res = await api.get(`/api/posts?page=${page}&limit=${limit}`)

    let posts = []
    if (Array.isArray(res)) posts = res
    else if (Array.isArray(res.posts)) posts = res.posts
    else if (Array.isArray(res.data)) posts = res.data
    else if (Array.isArray(res.data?.posts)) posts = res.data.posts
    else posts = []

    const realPosts = posts.map(p => ({
      ...p,
      user: {
        _id: p.author?._id,
        username: p.author?.username,
        handle: p.author?.username,
        avatar: p.author?.profileImage || '',
      },
      liked: p.liked || false,
    }))

    // merge real posts first, then fake ones
    let merged = [...realPosts, ...FAKE_POSTS]

    if (filter === 'most_liked') {
      merged = merged.sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0))
    } else if (filter === 'most_commented') {
      merged = merged.sort((a, b) => (b.commentsCount || 0) - (a.commentsCount || 0))
    }

    return merged
  } catch (err) {
    console.log('getPosts error:', err)
    return FAKE_POSTS
  }
},

  createPost: async ({ text, imageFile }) => {
  const formData = new FormData()
  if (text) formData.append('text', text)
  if (imageFile) formData.append('image', imageFile)

  const res = await api.post('/api/posts', formData, {
    headers: { 
      'Content-Type': undefined  // let browser set it with boundary
    },
  })
  const p = res.post || res.data?.post || res.data || res
  return {
    ...p,
    user: {
      _id: p.author?._id,
      username: p.author?.username,
      handle: p.author?.username,
      avatar: p.author?.profileImage || '',
    },
    liked: false,
  }
},

  likePost: async (postId) => {
    const res = await api.post(`/api/posts/${postId}/like`)
    return res
  },

commentPost: async (postId, text) => {
  const res = await api.post(`/api/posts/${postId}/comment`, { text })
  const c = res.comment || res.data?.comment || res
  return {
    _id: c._id,
    text: c.text,
    createdAt: c.createdAt || new Date().toISOString(),
    user: {
      _id: c.user?._id || c.user,
      username: c.username || c.user?.username || 'User',
      avatar: c.user?.profileImage || '',
    },
  }
},

getUserPosts: async (userId) => {
  const res = await api.get(`/api/posts?limit=50&page=1`)
  const posts = Array.isArray(res) ? res
    : Array.isArray(res.posts) ? res.posts
    : Array.isArray(res.data) ? res.data
    : Array.isArray(res.data?.posts) ? res.data.posts
    : []
  return posts
    .filter(p => p.author?._id === userId || p.author === userId)
    .map(p => ({
      ...p,
      user: {
        _id: p.author?._id,
        username: p.author?.username,
        handle: p.author?.username,
        avatar: p.author?.profileImage || '',
      },
      liked: false,
    }))
},

  getUser: async (userId) => {
    const res = await api.get('/api/auth/me')
    return res.user || res
  },
}