const AuthService = require('../services/authService');
const User = require('../models/User');

class AuthController {
  /**
   * 用户注册
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   */
  static async register(req, res) {
    try {
      const { username, email, password } = req.body;
      
      // 验证必填字段
      if (!username || !email || !password) {
        return res.status(400).json({ error: '用户名、邮箱和密码为必填项' });
      }
      
      // 密码长度验证
      if (password.length < 6) {
        return res.status(400).json({ error: '密码长度至少为6位' });
      }
      
      // 执行注册
      const result = await AuthService.register(username, email, password);
      
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  
  /**
   * 用户登录
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // 验证必填字段
      if (!email || !password) {
        return res.status(400).json({ error: '邮箱和密码为必填项' });
      }
      
      // 执行登录
      const result = await AuthService.login(email, password);
      
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  
  /**
   * 获取当前用户信息
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   */
  static async getCurrentUser(req, res) {
    try {
      // 从数据库获取完整用户信息
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password_hash'] } // 排除密码字段
      });
      
      if (!user) {
        return res.status(404).json({ error: '用户不存在' });
      }
      
      res.json({ user });
    } catch (error) {
      res.status(500).json({ error: '获取用户信息失败' });
    }
  }
  
  /**
   * 用户登出
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   */
  static async logout(req, res) {
    // JWT是无状态的，客户端删除token即可
    res.json({ message: '登出成功' });
  }
}

module.exports = AuthController;