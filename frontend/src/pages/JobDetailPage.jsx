import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { jobAPI } from '../services/api'
import JobDetail from '../components/job/JobDetail'
import { useNavigate } from 'react-router-dom'

const JobDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return
      
      setLoading(true)
      setError(null)
      try {
        const response = await jobAPI.getJobById(id)
        setJob(response.data)
      } catch (err) {
        setError('获取职位详情失败')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
  }, [id])

  if (loading) {
    return (
      <div className="job-detail-page">
        <div className="job-detail-container">
          <div className="loading">加载中...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="job-detail-page">
        <div className="job-detail-container">
          <div className="error">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="job-detail-page">
      <div className="job-detail-container">
        <div className="back-button-container">
          <button className="back-button" onClick={() => navigate(-1)}>
            ← 返回职位列表
          </button>
        </div>
        <JobDetail job={job} />
      </div>
    </div>
  )
}

export default JobDetailPage