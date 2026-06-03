import React, { createContext, useContext, useState, useCallback } from 'react'
import { postsAPI } from '../api/posts'

const PostContext = createContext(null)

export function PostProvider({ children }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchPosts = useCallback(async (newFilter = filter, newPage = 1) => {
    setLoading(true)
    try {
      const data = await postsAPI.getPosts({ filter: newFilter, page: newPage })
      if (newPage === 1) setPosts(data.posts || data)
      else setPosts(prev => [...prev, ...(data.posts || data)])
      setHasMore((data.posts || data).length === 10)
      setPage(newPage)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [filter])

  const addPost = (post) => setPosts(prev => [post, ...prev])

  const toggleLike = (postId, liked, count) => {
    setPosts(prev => prev.map(p =>
      p._id === postId ? { ...p, liked, likesCount: count } : p
    ))
  }

  const addComment = (postId, comment) => {
    setPosts(prev => prev.map(p =>
      p._id === postId
        ? { ...p, commentsCount: (p.commentsCount || 0) + 1, comments: [...(p.comments || []), comment] }
        : p
    ))
  }

  return (
    <PostContext.Provider value={{ posts, loading, filter, setFilter, fetchPosts, addPost, toggleLike, addComment, hasMore, page }}>
      {children}
    </PostContext.Provider>
  )
}

export const usePosts = () => useContext(PostContext)
