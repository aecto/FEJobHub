import axios from 'axios'

// 创建axios实例
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 从localStorage获取token（普通用户token或管理员token）
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // token过期或无效，清除本地存储并跳转到登录页
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('adminToken')
      // 只有在访问非管理员登录页面时才跳转
      if (!window.location.pathname.includes('/admin')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// 认证相关API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  adminLogin: (credentials) => api.post('/auth/admin-login', credentials),
  getCurrentUser: () => api.get('/auth/profile'),
  logout: () => api.post('/auth/logout')
}

// 职位相关API
export const jobAPI = {
  getJobs: (params) => api.get('/jobs', { params }),
  getJobById: (id) => api.get(`/jobs/${id}`),
  uploadExcel: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/jobs/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  deleteJob: (id) => api.delete(`/jobs/${id}`)
}

// 管理员相关API
export const adminAPI = {
  getUsers: (params) => api.get('/admin/users', { params }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getDashboardData: () => api.get('/admin/dashboard')
}

export default api