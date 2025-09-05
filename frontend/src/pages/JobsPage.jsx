import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import JobList from '../components/job/JobList'
import { authAPI } from '../services/api'
import '../components/job/JobStyles.css'

const JobsPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [currentUser, setCurrentUser] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false)

  // 检查用户登录状态
  React.useEffect(() => {
    checkUserStatus()
  }, [])

  const checkUserStatus = () => {
    const user = localStorage.getItem('user')
    if (user) {
      setCurrentUser(JSON.parse(user))
    }
  }

  const handleLogout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('登出请求失败:', error)
    } finally {
      // 清除本地存储
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setCurrentUser(null)
      setShowDropdown(false)
      // 不需要跳转，保持在当前页面
      // navigate('/login')
    }
  }

  // 获取当前激活的导航项
  const getActiveNav = () => {
    if (location.pathname === '/forum') return 'forum'
    if (location.pathname === '/interview') return 'interview'
    return 'jobs' // 默认为jobs
  }

  const activeNav = getActiveNav()

  return (
    <div className="jobs-page">
      {/* 页眉 */}
      <header className="jobs-header">
        <div className="header-content">
          <h1 className="logo" onClick={() => navigate('/')}>FEJobHub</h1>
          <div className="user-section">
            {currentUser ? (
              <div className="user-dropdown">
                <div 
                  className="user-info" 
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  {currentUser.username}
                </div>
                {showDropdown && (
                  <div className="dropdown-menu">
                    <button onClick={handleLogout}>Sign Out</button>
                  </div>
                )}
              </div>
            ) : (
              <button className="login-button" onClick={() => navigate('/login', { state: { from: { pathname: '/jobs' } } })}>
                登录
              </button>
            )}
          </div>
        </div>
        
        {/* 导航栏 */}
        <nav className="jobs-navigation">
          <div 
            className={`nav-item ${activeNav === 'jobs' ? 'active' : ''}`}
            onClick={() => navigate('/jobs')}
          >
            官网信息
          </div>
          <div 
            className={`nav-item ${activeNav === 'forum' ? 'active' : ''}`}
            onClick={() => navigate('/forum')}
          >
            社招论坛
          </div>
          <div 
            className={`nav-item ${activeNav === 'interview' ? 'active' : ''}`}
            onClick={() => navigate('/interview')}
          >
            面试交流
          </div>
        </nav>
      </header>
      
      <div className="jobs-container">
        <div className="jobs-main-full">
          <JobList />
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