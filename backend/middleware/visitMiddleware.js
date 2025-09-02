const Visit = require('../models/Visit');

/**
 * 记录网站访问的中间件
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一步函数
 */
async function recordVisit(req, res, next) {
  try {
    // 记录访问信息
    await Visit.create({
      ip_address: req.ip || req.connection.remoteAddress,
      user_agent: req.get('User-Agent'),
      page_url: req.originalUrl,
      user_id: req.user ? req.user.id : null,
      visited_at: new Date()
    });
  } catch (error) {
    // 记录访问失败不应该影响正常请求处理
    console.error('记录访问信息失败:', error);
  }
  
  next();
}

module.exports = recordVisit;