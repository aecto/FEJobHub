const AuthService = require('../services/authService');

/**
 * 身份验证中间件
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一步函数
 */
function authenticateToken(req, res, next) {
  // 从请求头获取token
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ error: '访问令牌缺失' });
  }
  
  // 验证token
  const result = AuthService.verifyToken(token);
  
  if (!result.success) {
    return res.status(403).json({ error: '访问令牌无效' });
  }
  
  // 将用户信息添加到请求对象
  req.user = result.user;
  next();
}

/**
 * 管理员权限验证中间件
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一步函数
 */
function authorizeAdmin(req, res, next) {
  // 首先验证token
  authenticateToken(req, res, function() {
    // 检查用户是否为管理员
    if (!AuthService.isAdmin(req.user)) {
      return res.status(403).json({ error: '需要管理员权限' });
    }
    
    next();
  });
}

module.exports = {
  authenticateToken,
  authorizeAdmin
};