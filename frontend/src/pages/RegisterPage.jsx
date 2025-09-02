import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import './AuthStyles.css'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // 验证密码确认
    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      const response = await authAPI.register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      })
      
      // 保存token和用户信息到localStorage
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      
      // 跳转到主页
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || '注册失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>用户注册</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">用户名:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">邮箱:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">密码:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">确认密码:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? '注册中...' : '注册'}
          </button>
        </form>
        <div className="auth-links">
          <p>
            已有账户？ <a href="/login">立即登录</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage