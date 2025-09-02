import React, { useState, useEffect } from 'react'
import { authAPI, adminAPI, jobAPI } from '../services/api'
import './AdminStyles.css'

const AdminPage = () => {
  const [users, setUsers] = useState([])
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [file, setFile] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  })

  // 检查是否已登录
  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      setIsLoggedIn(true)
    }
  }, [])

  // 获取仪表板数据
  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const response = await adminAPI.getDashboardData()
      // 这里可以设置仪表板数据状态
      console.log(response.data)
    } catch (err) {
      setError('获取仪表板数据失败')
    } finally {
      setLoading(false)
    }
  }

  // 获取用户列表
  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await adminAPI.getUsers()
      setUsers(response.data.users)
    } catch (err) {
      setError('获取用户列表失败')
    } finally {
      setLoading(false)
    }
  }

  // 获取职位列表
  const fetchJobs = async () => {
    setLoading(true)
    try {
      const response = await jobAPI.getJobs()
      setJobs(response.data.jobs)
    } catch (err) {
      setError('获取职位列表失败')
    } finally {
      setLoading(false)
    }
  }

  // 删除用户
  const handleDeleteUser = async (userId) => {
    if (window.confirm('确定要删除这个用户吗？')) {
      try {
        await adminAPI.deleteUser(userId)
        // 重新获取用户列表
        fetchUsers()
      } catch (err) {
        setError('删除用户失败')
      }
    }
  }

  // 删除职位
  const handleDeleteJob = async (jobId) => {
    if (window.confirm('确定要删除这个职位吗？')) {
      try {
        await jobAPI.deleteJob(jobId)
        // 重新获取职位列表
        fetchJobs()
      } catch (err) {
        setError('删除职位失败')
      }
    }
  }

  // 处理文件上传
  const handleFileUpload = async () => {
    if (!file) {
      alert('请选择文件')
      return
    }

    try {
      await jobAPI.uploadExcel(file)
      alert('文件上传成功')
      setFile(null)
    } catch (err) {
      setError('文件上传失败')
    }
  }

  // 处理文件选择
  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  // 处理登录表单输入
  const handleLoginChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value
    })
  }

  // 处理管理员登录
  const handleAdminLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const response = await authAPI.adminLogin(loginForm)
      // 保存token到localStorage
      localStorage.setItem('adminToken', response.data.token)
      setIsLoggedIn(true)
    } catch (err) {
      setError(err.response?.data?.error || '登录失败')
    } finally {
      setLoading(false)
    }
  }

  // 处理管理员登出
  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken')
    setIsLoggedIn(false)
    setLoginForm({
      username: '',
      password: ''
    })
  }

  // 如果未登录，显示登录表单
  if (!isLoggedIn) {
    return (
      <div className="admin-page">
        <div className="admin-login-container">
          <h1>管理员登录</h1>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleAdminLogin}>
            <div className="form-group">
              <label htmlFor="username">管理员用户名:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={loginForm.username}
                onChange={handleLoginChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">密码:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={loginForm.password}
                onChange={handleLoginChange}
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? '登录中...' : '登录'}
            </button>
          </form>
          <div className="login-info">
            <p>用户名: fejobhubadmin</p>
            <p>密码: fejobhubAdmin&250901</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>管理员面板</h1>
        <button className="logout-button" onClick={handleAdminLogout}>
          登出
        </button>
      </div>
      
      <div className="admin-tabs">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          仪表板
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => {
            setActiveTab('users')
            fetchUsers()
          }}
        >
          用户管理
        </button>
        <button 
          className={activeTab === 'jobs' ? 'active' : ''}
          onClick={() => {
            setActiveTab('jobs')
            fetchJobs()
          }}
        >
          职位管理
        </button>
        <button 
          className={activeTab === 'upload' ? 'active' : ''}
          onClick={() => setActiveTab('upload')}
        >
          文件上传
        </button>
      </div>
      
      <div className="admin-content">
        {error && <div className="error-message">{error}</div>}
        
        {activeTab === 'dashboard' && (
          <div className="dashboard-tab">
            <h2>仪表板</h2>
            <p>欢迎来到管理员面板</p>
          </div>
        )}
        
        {activeTab === 'users' && (
          <div className="users-tab">
            <h2>用户管理</h2>
            {loading ? (
              <div>加载中...</div>
            ) : (
              <table className="users-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>用户名</th>
                    <th>邮箱</th>
                    <th>角色</th>
                    <th>创建时间</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>{new Date(user.created_at).toLocaleDateString()}</td>
                      <td>
                        <button 
                          className="delete-button"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          删除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
        
        {activeTab === 'jobs' && (
          <div className="jobs-tab">
            <h2>职位管理</h2>
            {loading ? (
              <div>加载中...</div>
            ) : (
              <table className="jobs-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>职位标题</th>
                    <th>公司名称</th>
                    <th>工作地点</th>
                    <th>创建时间</th>
                    <th>过期时间</th>
                    <th>状态</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map(job => (
                    <tr key={job.id}>
                      <td>{job.id}</td>
                      <td>{job.title}</td>
                      <td>{job.company_name}</td>
                      <td>{job.location}</td>
                      <td>{new Date(job.created_at).toLocaleDateString()}</td>
                      <td>{new Date(job.expires_at).toLocaleDateString()}</td>
                      <td>{job.status}</td>
                      <td>
                        <button 
                          className="delete-button"
                          onClick={() => handleDeleteJob(job.id)}
                        >
                          删除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
        
        {activeTab === 'upload' && (
          <div className="upload-tab">
            <h2>文件上传</h2>
            <div className="upload-section">
              <input 
                type="file" 
                accept=".xlsx" 
                onChange={handleFileChange} 
              />
              <button onClick={handleFileUpload}>上传XLSX文件</button>
              {file && <p>已选择文件: {file.name}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPage