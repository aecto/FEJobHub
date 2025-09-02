import React, { useState, useEffect } from 'react'
import JobList from '../components/job/JobList'
import JobDetail from '../components/job/JobDetail'
import { jobAPI } from '../services/api'
import '../components/job/JobStyles.css'

const JobsPage = () => {
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
      <div className="jobs-container">
        <div className="jobs-sidebar">
          <JobList onJobSelect={setSelectedJob} selectedJob={selectedJob} />
        </div>
        <div className="jobs-main">
          <JobDetail job={selectedJob} />
        </div>
      </div>
    </div>
  )
}

export default JobsPage