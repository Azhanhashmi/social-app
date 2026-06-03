import api from './axios'

export const postsAPI = {
  getPosts: (params) => api.get('/api/posts', { params }),
  getPost: (id) => api.get(`/api/posts/${id}`),
  createPost: (data) => api.post('/api/posts', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  likePost: (id) => api.post(`/api/posts/${id}/like`),
  commentPost: (id, text) => api.post(`/api/posts/${id}/comment`, { text }),
  getUserPosts: (userId) => api.get(`/api/posts`, { params: { userId, limit: 50 } }),
}
