import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { jobAPI } from '../../services/api'
import JobListItem from './JobListItem'
import JobSearch from './JobSearch'
import JobPagination from './JobPagination'

const JobList = () => {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchParams, setSearchParams] = useState({
    page: 1,
    limit: 30,
    company: '',
    title: '',
    skills: '',
    location: ''
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 30,
    total: 0,
    totalPages: 0
  })

  // 获取职位列表
  const fetchJobs = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await jobAPI.getJobs(searchParams)
      setJobs(response.data.jobs)
      setPagination(response.data.pagination)
    } catch (err) {
      setError('获取职位列表失败')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // 处理搜索
  const handleSearch = (params) => {
    setSearchParams({
      ...searchParams,
      ...params,
      page: 1
    })
  }

  // 处理分页
  const handlePageChange = (page) => {
    setSearchParams({
      ...searchParams,
      page
    })
  }

  // 处理职位选择（跳转到详情页）
  const handleJobSelect = (job) => {
    navigate(`/jobs/${job.id}`)
  }

  // 监听搜索参数变化
  useEffect(() => {
    fetchJobs()
  }, [searchParams])

  return (
    <div className="job-list-container">
      <div className="job-search-section">
        <JobSearch onSearch={handleSearch} />
      </div>
      
      <div className="job-list-section">
        {loading && <div className="loading">加载中...</div>}
        {error && <div className="error">{error}</div>}
        
        {!loading && !error && (
          <>
            <div className="job-list">
              {jobs.map(job => (
                <JobListItem 
                  key={job.id} 
                  job={job} 
                  onClick={() => handleJobSelect(job)} 
                />
              ))}
            </div>
            
            {jobs.length === 0 && (
              <div className="no-jobs">暂无职位信息</div>
            )}
            
            <div className="pagination-section">
              <JobPagination 
                pagination={pagination} 
                onPageChange={handlePageChange} 
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default JobList