import React from 'react'

const JobDetail = ({ job }) => {
  if (!job) {
    return (
      <div className="job-detail-placeholder">
        请选择职位查看详细信息
      </div>
    )
  }

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

  const handleApply = () => {
    if (job.job_apply_url) {
      window.open(job.job_apply_url, '_blank')
    }
  }

  return (
    <div className="job-detail">
      <div className="job-header">
        <h1 className="job-title">{job.title}</h1>
        <h2 className="job-company">{job.company_name}</h2>
        <div className="job-meta">
          <span className="job-location">{job.location}</span>
          <span className="job-salary">{job.salary_range || '面议'}</span>
          <span className="job-posted">发布于 {formatRelativeTime(job.created_at)}</span>
        </div>
      </div>
      
      <div className="job-content">
        {job.description && (
          <div className="job-section">
            <div className="job-description" dangerouslySetInnerHTML={{ __html: job.description }} />
          </div>
        )}
        
        {job.requirements && (
          <div className="job-section">
            <div className="job-requirements" dangerouslySetInnerHTML={{ __html: job.requirements }} />
          </div>
        )}
      </div>
      
      <div className="job-actions">
        <button className="apply-button" onClick={handleApply}>
          官方申请
        </button>
      </div>
    </div>
  )
}

export default JobDetail