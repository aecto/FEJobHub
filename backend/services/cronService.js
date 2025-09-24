const schedule = require('node-schedule');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const Job = require('../models/Job');
const Company = require('../models/Company');

class CronService {
  /**
   * 启动定时任务
   */
  static startCronJobs() {
    // 注释掉原来的定时任务，改为只保留过期职位清理任务
    /*
    // 每天凌晨2点执行Python脚本和CSV处理任务
    const dailyJob = schedule.scheduleJob('0 0 2 * * 2，6', async () => {
      console.log('开始执行每日Python脚本和CSV处理任务');
      await CronService.processDailyCSVFile();
    });
    */
    
    // 每天凌晨1点执行过期职位清理任务
    const cleanupJob = schedule.scheduleJob('0 0 1 * * *', async () => {
      console.log('开始执行过期职位清理任务');
      await CronService.cleanupExpiredJobs();
    });
    
    console.log('定时任务已启动');
  }
  
  /**
   * 处理每日CSV文件 (已废弃，保留函数但不执行任何操作)
   */
  static async processDailyCSVFile() {
    // 已废弃的函数，不再执行任何操作
    console.log('定时CSV处理已禁用');
    return;
  }
  
  /**
   * 解析CSV文件并返回数据
   * @param {string} filePath - CSV文件路径
   * @returns {Array} 解析后的数据数组
   */
  static async parseCSVFile(filePath) {
    try {
      const csv = require('csv-parser');
      const results = [];
      
      return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', () => resolve(results))
          .on('error', (error) => reject(error));
      });
    } catch (error) {
      throw new Error(`解析CSV文件失败: ${error.message}`);
    }
  }
  
  /**
   * 处理职位数据并准备插入数据库
   * @param {Array} rawData - 原始数据
   * @returns {Array} 处理后的数据
   */
  static async processJobData(rawData) {
    try {
      const currentDate = new Date();
      const expiryDate = new Date();
      expiryDate.setDate(currentDate.getDate() + 60); // 60天后过期
      
      // 读取location.json文件
      const locationFilePath = path.join(__dirname, '../../datasource/location.json');
      const locationData = JSON.parse(fs.readFileSync(locationFilePath, 'utf8'));
      
      const processedData = [];
      
      for (const item of rawData) {
        // 解析location字段中的C+数字格式
        let location = item.location || "";
        const locationMatch = location.match(/C(\d+)/i);
        if (locationMatch) {
          // console.log(`match location: ${locationMatch[1]}`);
          const locationKey = `C${locationMatch[1]}`;
          // console.log(`locationData: ${locationData[locationKey]}`);
          if (locationData[locationKey]) {
            location = locationData[locationKey];
          }
        }
        
        // 处理job_apply_url，去除utm_source=indeed及之后字符
        let jobApplyUrl = item.job_url_direct || item.job_apply_url || "";
        const utmIndex = jobApplyUrl.indexOf('utm_source=indeed');
        if (utmIndex !== -1) {
          jobApplyUrl = jobApplyUrl.substring(0, utmIndex - 1); // -1是为了去掉前面的&
        }
        
        // 截断过长的URL（限制在1000字符以内）
        if (jobApplyUrl.length > 1000) {
          jobApplyUrl = jobApplyUrl.substring(0, 1000);
        }
        
        // 处理薪水范围，固定为"面议"
        const salaryRange = "面议";
        
        // 处理公司信息
        const companyName = item.company || item.company_name || "";
        const companyUrlDirect = item.company_url_direct || "";
        
        // 检查公司是否已存在
        const existingCompany = await Company.findOne({
          where: {
            company_name: companyName
          }
        });
        
        // 如果公司不存在，则创建新记录
        if (!existingCompany) {
          await Company.create({
            company_name: companyName,
            career_url: companyUrlDirect
          });
        }
        
        processedData.push({
          title: item.title || "",
          company_name: companyName,
          location: location,
          salary_range: salaryRange,
          description: item.description || "",
          requirements: item.requirements || "",
          job_apply_url: jobApplyUrl,
          is_remote: item.is_remote === "True" || item.is_remote === "true" || false,
          created_at: currentDate,
          expires_at: expiryDate,
          status: 'active'
        });
      }
      
      return processedData;
    } catch (error) {
      throw new Error(`处理职位数据失败: ${error.message}`);
    }
  }
  
  /**
   * 将数据插入数据库
   * @param {Array} jobData - 处理后的职位数据
   * @returns {Object} 插入结果
   */
  static async insertJobs(jobData) {
    try {
      const result = await Job.bulkCreate(jobData, {
        validate: true,
        returning: true
      });
      
      return {
        success: true,
        count: result.length,
        message: `成功插入 ${result.length} 条职位信息`
      };
    } catch (error) {
      throw new Error(`插入数据库失败: ${error.message}`);
    }
  }
  
  /**
   * 清理过期职位
   */
  static async cleanupExpiredJobs() {
    try {
      const { Op } = require('sequelize');
      
      const result = await Job.destroy({
        where: {
          expires_at: {
            [Op.lt]: new Date()
          }
        }
      });
      
      console.log(`清理了 ${result} 条过期职位信息`);
    } catch (error) {
      console.error('清理过期职位失败:', error.message);
    }
  }
}

module.exports = CronService;