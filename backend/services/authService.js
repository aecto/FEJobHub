const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthService {
  /**
   * 用户注册
   * @param {string} username - 用户名
   * @param {string} email - 邮箱
   * @param {string} password - 密码
   * @returns {Object} 注册结果
   */
  static async register(username, email, password) {
    try {
      // 检查用户是否已存在
      const existingUser = await User.findOne({
        where: {
          [require('sequelize').Op.or]: [
            { username: username },
            { email: email }
          ]
        }
      });
      
      if (existingUser) {
        throw new Error('用户名或邮箱已存在');
      }
      
      // 密码加密
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      
      // 创建用户
      const user = await User.create({
        username,
        email,
        password_hash: passwordHash,
        role: 'user' // 默认为普通用户
      });
      
      // 生成JWT token
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
      
      // 返回用户信息和token（不包含密码）
      const userData = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        created_at: user.created_at
      };
      
      return {
        success: true,
        token,
        user: userData
      };
    } catch (error) {
      throw new Error(`注册失败: ${error.message}`);
    }
  }
  
  /**
   * 用户登录
   * @param {string} email - 邮箱
   * @param {string} password - 密码
   * @returns {Object} 登录结果
   */
  static async login(email, password) {
    try {
      // 查找用户
      const user = await User.findOne({ where: { email } });
      
      if (!user) {
        throw new Error('用户不存在');
      }
      
      // 验证密码
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      
      if (!isPasswordValid) {
        throw new Error('密码错误');
      }
      
      // 更新最后登录时间
      await user.update({ last_login: new Date() });
      
      // 生成JWT token
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
      
      // 返回用户信息和token（不包含密码）
      const userData = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        created_at: user.created_at
      };
      
      return {
        success: true,
        token,
        user: userData
      };
    } catch (error) {
      throw new Error(`登录失败: ${error.message}`);
    }
  }
  
  /**
   * 验证JWT token
   * @param {string} token - JWT token
   * @returns {Object} 验证结果
   */
  static verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return {
        success: true,
        user: decoded
      };
    } catch (error) {
      return {
        success: false,
        error: 'Token验证失败'
      };
    }
  }
  
  /**
   * 验证用户是否为管理员
   * @param {Object} user - 用户对象
   * @returns {boolean} 是否为管理员
   */
  static isAdmin(user) {
    return user && user.role === 'admin';
  }
}

module.exports = AuthService;