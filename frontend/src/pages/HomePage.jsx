import React from 'react'
import { useNavigate } from 'react-router-dom'
import './HomeStyles.css'

const HomePage = () => {
  const navigate = useNavigate()

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>FEJobHub</h1>
          <h2>外职汇</h2>
          <p>发现并申请全球领先企业的职位机会</p>
          <div className="hero-buttons">
            <button className="primary-button" onClick={() => navigate('/jobs')}>
              浏览职位
            </button>
            <button className="secondary-button" onClick={() => navigate('/login')}>
              登录/注册
            </button>
          </div>
        </div>
      </div>
      
      <div className="features-section">
        <div className="feature">
          <h3>海量职位</h3>
          <p>汇集全球企业的招聘信息</p>
        </div>
        <div className="feature">
          <h3>精准搜索</h3>
          <p>支持多维度精准搜索职位</p>
        </div>
        <div className="feature">
          <h3>一键申请</h3>
          <p>直达官方申请页真实信息</p>
        </div>
      </div>
    </div>
  )
}

export default HomePage