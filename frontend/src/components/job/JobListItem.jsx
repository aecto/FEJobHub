import React from 'react'

const JobListItem = ({ job, onClick, isSelected }) => {
  // 格式化相对时间
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return '刚刚'
    } else if (diffInHours < 24) {
      return `${diffInHours}小时前`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}天前`
    }
  }

  return (
    <div 
      className={`job-list-item ${isSelected ? 'selected' : ''}`} 
      onClick={() => onClick(job)}
    >
      <div className="job-title">{job.title}</div>
      <div className="job-company">{job.company_name}</div>
      <div className="job-location">{job.location}</div>
      <div className="job-salary">{job.salary_range || '面议'}</div>
      <div className="job-posted">{formatRelativeTime(job.created_at)}</div>
    </div>
  )
}

export default JobListItem