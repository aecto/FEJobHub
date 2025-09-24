import React from 'react'
import { useNavigate } from 'react-router-dom'
import './AuthStyles.css'
import './HomeStyles.css'

const InterviewPage = () => {
  const navigate = useNavigate()

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="logo" onClick={() => navigate('/')}>FEJobHub</h1>
        </div>
        
        <div className="auth-form">
          <h2>面试交流</h2>
          <div className="coming-soon">
            <div className="construction-icon">🚧</div>
            <p className="coming-soon-text">页面正在开发中...</p>
            <p className="coming-soon-subtext">敬请期待！</p>
          </div>
          
          <button 
            className="back-button" 
            onClick={() => navigate('/jobs')}
            style={{ marginTop: '20px' }}
          >
            返回职位页面
          </button>
        </div>
      </div>
      
      <footer className="auth-footer">
        <div className="footer-content">
          <p>&copy; 2025 FEJobHub. All rights reserved. 备案号：辽ICP备2025064354号</p>
        </div>
      </footer>
    </div>
  )
}

export default InterviewPage