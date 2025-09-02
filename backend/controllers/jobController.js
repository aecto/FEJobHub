const fs = require('fs');
const path = require('path');
const ExcelParser = require('../services/excelParser');
const Job = require('../models/Job');

class JobController {
  /**
   * 上传并处理XLSX文件
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   */
  static async uploadExcel(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: '未找到上传文件' });
      }
      
      // 检查文件扩展名
      const fileExtension = path.extname(req.file.originalname).toLowerCase();
      if (fileExtension !== '.xlsx') {
        return res.status(400).json({ error: '只支持XLSX文件格式' });
      }
      
      // 解析文件
      const rawData = ExcelParser.parseFile(req.file.path);
      
      // 处理数据
      const jobData = ExcelParser.processJobData(rawData);
      
      // 插入数据库
      const result = await ExcelParser.insertJobs(jobData);
      
      // 删除临时文件
      fs.unlinkSync(req.file.path);
      
      res.json({
        message: '文件处理成功',
        ...result
      });
    } catch (error) {
      // 确保删除临时文件
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      
      res.status(500).json({ 
        error: '文件处理失败',
        details: error.message 
      });
    }
  }
  
  /**
   * 获取职位列表（支持搜索和分页）
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   */
  static async getJobs(req, res) {
    try {
      const { 
        page = 1, 
        limit = 30, 
        company, 
        title, 
        skills, 
        location 
      } = req.query;
      
      // 构建查询条件
      const whereConditions = {
        status: 'active',
        expires_at: {
          [require('sequelize').Op.gt]: new Date()
        }
      };
      
      // 添加搜索条件
      if (company) {
        whereConditions.company_name = {
          [require('sequelize').Op.like]: `%${company}%`
        };
      }
      
      if (title) {
        whereConditions.title = {
          [require('sequelize').Op.like]: `%${title}%`
        };
      }
      
      if (skills) {
        whereConditions.skills = {
          [require('sequelize').Op.like]: `%${skills}%`
        };
      }
      
      if (location) {
        whereConditions.location = {
          [require('sequelize').Op.like]: `%${location}%`
        };
      }
      
      // 查询数据
      const result = await Job.findAndCountAll({
        where: whereConditions,
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit),
        order: [['created_at', 'DESC']]
      });
      
      res.json({
        jobs: result.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: result.count,
          totalPages: Math.ceil(result.count / parseInt(limit))
        }
      });
    } catch (error) {
      res.status(500).json({ 
        error: '获取职位列表失败',
        details: error.message 
      });
    }
  }
  
  /**
   * 获取职位详情
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   */
  static async getJobById(req, res) {
    try {
      const { id } = req.params;
      
      const job = await Job.findOne({
        where: {
          id: id,
          status: 'active',
          expires_at: {
            [require('sequelize').Op.gt]: new Date()
          }
        }
      });
      
      if (!job) {
        return res.status(404).json({ error: '职位信息不存在或已过期' });
      }
      
      res.json(job);
    } catch (error) {
      res.status(500).json({ 
        error: '获取职位详情失败',
        details: error.message 
      });
    }
  }
  
  /**
   * 删除职位（管理员功能）
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   */
  static async deleteJob(req, res) {
    try {
      const { id } = req.params;
      
      const job = await Job.findByPk(id);
      if (!job) {
        return res.status(404).json({ error: '职位信息不存在' });
      }
      
      await job.destroy();
      
      res.json({ message: '职位信息删除成功' });
    } catch (error) {
      res.status(500).json({ 
        error: '删除职位信息失败',
        details: error.message 
      });
    }
  }
}

module.exports = JobController;