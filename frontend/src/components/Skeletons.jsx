import React from 'react'
import { Box } from '@mui/material'

function SkeletonLine({ width = '100%', height = 14, mb = 1 }) {
  return <Box className="skeleton" sx={{ width, height, borderRadius: 1, mb }} />
}

export function PostSkeleton() {
  return (
    <Box sx={{ background: '#fff', borderRadius: '16px', p: 2, mb: 1.5, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <Box display="flex" alignItems="center" mb={1.5}>
        <Box className="skeleton" sx={{ width: 46, height: 46, borderRadius: '50%', mr: 1.5, flexShrink: 0 }} />
        <Box flex={1}>
          <SkeletonLine width="50%" height={14} mb={0.75} />
          <SkeletonLine width="35%" height={12} mb={0} />
        </Box>
      </Box>
      <SkeletonLine height={14} mb={0.75} />
      <SkeletonLine width="80%" height={14} mb={0.75} />
      <SkeletonLine width="55%" height={14} mb={1.5} />
      <Box className="skeleton" sx={{ width: '100%', height: 160, borderRadius: '12px', mb: 1.5 }} />
      <Box display="flex" gap={3} mt={0.5}>
        <SkeletonLine width={60} height={12} mb={0} />
        <SkeletonLine width={60} height={12} mb={0} />
        <SkeletonLine width={60} height={12} mb={0} />
      </Box>
    </Box>
  )
}

export function ProfileSkeleton() {
  return (
    <Box>
      <Box sx={{ background: '#fff', borderRadius: '0 0 24px 24px', p: 3, textAlign: 'center', mb: 2 }}>
        <Box className="skeleton" sx={{ width: 88, height: 88, borderRadius: '50%', mx: 'auto', mb: 1.5 }} />
        <SkeletonLine width="60%" height={20} mb={0.75} />
        <SkeletonLine width="40%" height={14} mb={1.5} />
        <Box display="flex" justifyContent="center" gap={4}>
          {[1,2,3].map(i => (
            <Box key={i} textAlign="center">
              <SkeletonLine width={40} height={20} mb={0.5} />
              <SkeletonLine width={50} height={12} mb={0} />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
