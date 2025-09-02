import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import JobList from '../components/job/JobList'
import JobDetail from '../components/job/JobDetail'
import { jobAPI } from '../services/api'
import '../components/job/JobStyles.css'

const JobsPage = () => {
  const navigate = useNavigate()
  const [selectedJob, setSelectedJob] = useState(null)

  // 页面加载时默认选择第一个职位
  useEffect(() => {
    const fetchFirstJob = async () => {
      try {
        const response = await jobAPI.getJobs({ page: 1, limit: 1 })
        if (response.data.jobs && response.data.jobs.length > 0) {
          setSelectedJob(response.data.jobs[0])
        }
      } catch (error) {
        console.error('获取第一个职位失败:', error)
      }
    }

    fetchFirstJob()
  }, [])

  return (
    <div className="jobs-page">
      {/* 页眉 */}
      <header className="jobs-header">
        <div className="header-content">
          <h1 className="logo" onClick={() => navigate('/')}>FEJobHub</h1>
        </div>
      </header>
      
      <div className="jobs-container">
        <div className="jobs-sidebar">
          <JobList onJobSelect={setSelectedJob} selectedJob={selectedJob} />
        </div>
        <div className="jobs-main">
          <JobDetail job={selectedJob} />
        </div>
      </div>
      
      {/* 页脚 */}
      <footer className="jobs-footer">
        <div className="footer-content">
          <p>&copy; 2025 FEJobHub. All rights reserved. 备案号：京ICP备XXXXXXXX号</p>
        </div>
      </footer>
    </div>
  )
}

export default JobsPage