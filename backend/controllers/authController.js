const AuthService = require('../services/authService');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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
      console.error('注册错误:', error);
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
      console.error('登录错误:', error);
      res.status(400).json({ error: error.message });
    }
  }
  
  /**
   * 管理员登录
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   */
  static async adminLogin(req, res) {
    try {
      console.log('管理员登录请求:', req.body);
      const { username, password } = req.body;
      
      // 验证必填字段
      if (!username || !password) {
        console.log('用户名或密码为空');
        return res.status(400).json({ error: '用户名和密码为必填项' });
      }
      
      // 从数据库查找用户
      console.log('正在查找用户:', username);
      const user = await User.findOne({ 
        where: { username: username },
        attributes: { exclude: ['password_hash'] }
      });
      
      console.log('找到用户:', user);
      
      // 检查用户是否存在
      if (!user) {
        console.log('用户不存在');
        return res.status(401).json({ error: '用户名或密码错误' });
      }
      
      // 检查用户是否为管理员
      if (user.role !== 'admin') {
        console.log('用户不是管理员，角色为:', user.role);
        return res.status(403).json({ error: '需要管理员权限' });
      }
      
      // 验证密码
      console.log('正在验证密码');
      // 注意：这里需要获取包含密码哈希的完整用户信息
      const fullUser = await User.findByPk(user.id);
      console.log('完整用户信息:', fullUser);
      const isPasswordValid = await bcrypt.compare(password, fullUser.password_hash);
      console.log('密码验证结果:', isPasswordValid);
      
      if (!isPasswordValid) {
        console.log('密码无效');
        return res.status(401).json({ error: '用户名或密码错误' });
      }
      
      // 更新最后登录时间
      console.log('更新最后登录时间');
      await user.update({ last_login: new Date() });
      
      // 生成JWT token
      console.log('生成JWT token');
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
      
      console.log('登录成功');
      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('管理员登录错误:', error);
      res.status(500).json({ error: '管理员登录失败: ' + error.message });
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
      console.error('获取用户信息错误:', error);
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