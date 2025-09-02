const User = require('../models/User');
const Job = require('../models/Job');

class AdminController {
  /**
   * 获取用户列表（支持分页）
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   */
  static async getUsers(req, res) {
    try {
      const { page = 1, limit = 30 } = req.query;
      
      const result = await User.findAndCountAll({
        attributes: { exclude: ['password_hash'] }, // 排除密码字段
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit),
        order: [['created_at', 'DESC']]
      });
      
      res.json({
        users: result.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: result.count,
          totalPages: Math.ceil(result.count / parseInt(limit))
        }
      });
    } catch (error) {
      res.status(500).json({ 
        error: '获取用户列表失败',
        details: error.message 
      });
    }
  }
  
  /**
   * 删除用户
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   */
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      
      // 不能删除自己
      if (parseInt(id) === req.user.id) {
        return res.status(400).json({ error: '不能删除自己的账户' });
      }
      
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: '用户不存在' });
      }
      
      await user.destroy();
      
      res.json({ message: '用户删除成功' });
    } catch (error) {
      res.status(500).json({ 
        error: '删除用户失败',
        details: error.message 
      });
    }
  }
  
  /**
   * 删除职位
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   */
  static async deleteJob(req, res) {
    try {
      const { id } = req.params;
      
      const job = await Job.findByPk(id);
      if (!job) {
        return res.status(404).json({ error: '职位不存在' });
      }
      
      await job.destroy();
      
      res.json({ message: '职位删除成功' });
    } catch (error) {
      res.status(500).json({ 
        error: '删除职位失败',
        details: error.message 
      });
    }
  }
  
  /**
   * 获取管理员仪表板数据
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   */
  static async getDashboardData(req, res) {
    try {
      // 获取统计信息
      const totalUsers = await User.count();
      const totalJobs = await Job.count();
      
      // 获取最近的职位
      const recentJobs = await Job.findAll({
        limit: 5,
        order: [['created_at', 'DESC']]
      });
      
      // 获取过期职位数量
      const expiredJobs = await Job.count({
        where: {
          expires_at: {
            [require('sequelize').Op.lt]: new Date()
          }
        }
      });
      
      res.json({
        dashboardData: {
          totalUsers,
          totalJobs,
          expiredJobs,
          recentJobs
        }
      });
    } catch (error) {
      res.status(500).json({ 
        error: '获取仪表板数据失败',
        details: error.message 
      });
    }
  }
}

module.exports = AdminController;