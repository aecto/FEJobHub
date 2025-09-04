const fs = require('fs');
const path = require('path');
const ExcelParser = require('../services/excelParser');
const Job = require('../models/Job');
const CronService = require('../services/cronService');

class JobController {
  /**
   * 上传并处理文件（支持XLSX和CSV）
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   */
  static async uploadFile(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: '未找到上传文件' });
      }
      
      // 检查文件扩展名
      const fileExtension = path.extname(req.file.originalname).toLowerCase();
      
      let jobData;
      
      if (fileExtension === '.xlsx') {
        // 处理XLSX文件
        const rawData = ExcelParser.parseFile(req.file.path);
        jobData = ExcelParser.processJobData(rawData);
      } else if (fileExtension === '.csv') {
        // 处理CSV文件
        const rawData = await CronService.parseCSVFile(req.file.path);
        jobData = await CronService.processJobData(rawData);
      } else {
        // 确保删除不支持的文件
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({ error: '只支持XLSX和CSV文件格式' });
      }
      
      // 插入数据库
      const result = await CronService.insertJobs(jobData);
      
      // 备份文件到databackup目录
      await JobController.backupFile(req.file.path, req.file.originalname);
      
      res.json({
        message: '文件处理成功',
        filePath: req.file.path, // 返回文件路径以便确认
        ...result
      });
    } catch (error) {
      // 确保在出错时也返回错误信息
      res.status(500).json({ 
        error: '文件处理失败',
        details: error.message 
      });
    }
  }
  
  /**
   * 备份文件到databackup目录
   * @param {string} sourcePath - 源文件路径
   * @param {string} originalName - 原始文件名
   */
  static async backupFile(sourcePath, originalName) {
    try {
      // 确保databackup目录存在
      const backupDir = path.join(__dirname, '../../databackup');
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }
      
      // 生成带日期的备份文件名
      const date = new Date();
      const dateString = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
      const timeString = `${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}`;
      const backupFileName = `${path.parse(originalName).name}_${dateString}_${timeString}${path.extname(originalName)}`;
      
      // 复制文件到备份目录
      const backupPath = path.join(backupDir, backupFileName);
      fs.copyFileSync(sourcePath, backupPath);
      
      console.log(`文件已备份到: ${backupPath}`);
    } catch (error) {
      console.error('文件备份失败:', error.message);
      // 不抛出错误，因为备份失败不应该影响主要功能
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