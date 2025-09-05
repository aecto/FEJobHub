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

  // 分享功能
  const handleShare = () => {
    if (navigator.share) {
      // 使用Web Share API
      navigator.share({
        title: job.title,
        text: `查看职位: ${job.title} at ${job.company_name}`,
        url: window.location.href
      }).catch(error => {
        console.log('分享失败:', error);
        // 如果Web Share API不可用，使用传统的复制链接方式
        fallbackShare();
      });
    } else {
      // 如果Web Share API不可用，使用传统的复制链接方式
      fallbackShare();
    }
  }

  // 传统分享方式（复制链接）
  const fallbackShare = () => {
    const textToCopy = `查看职位: ${job.title} at ${job.company_name} ${window.location.href}`;
    
    // 创建临时textarea元素来复制文本
    const textarea = document.createElement('textarea');
    textarea.value = textToCopy;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    
    // 显示提示信息
    alert('链接已复制到剪贴板，您可以粘贴到社交媒体分享！');
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
          <div className="button-group">
            <button className="apply-button-small" onClick={handleApply}>
              官网链接
            </button>
            <button className="share-button" onClick={handleShare} title="分享职位">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11 6.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2v7h9v-7h-2a.5.5 0 0 1-.5-.5z"/>
                <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
              </svg>
            </button>
          </div>
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
      
      {/* 底部的官方申请按钮已移至顶部，此处删除 */}
    </div>
  )
}

export default JobDetail