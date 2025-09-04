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
    // 每天凌晨2点执行Python脚本和CSV处理任务
    const dailyJob = schedule.scheduleJob('0 0 2 * * 2，6', async () => {
      console.log('开始执行每日Python脚本和CSV处理任务');
      await CronService.processDailyCSVFile();
    });
    
    // 每天凌晨1点执行过期职位清理任务
    const cleanupJob = schedule.scheduleJob('0 0 1 * * *', async () => {
      console.log('开始执行过期职位清理任务');
      await CronService.cleanupExpiredJobs();
    });
    
    console.log('定时任务已启动');
  }
  
  /**
   * 处理每日CSV文件
   */
  static async processDailyCSVFile() {
    try {
      const datasourceDir = path.join(__dirname, '../datasource');
      const csvFilePath = path.join(datasourceDir, 'jobs.csv');
      const pythonScriptPath = path.join(datasourceDir, 'test-job-spy.py');
      
      // 执行Python脚本
      console.log('开始执行Python脚本');
      const { stdout, stderr } = await execPromise(`python3 ${pythonScriptPath}`, {
        cwd: datasourceDir
      });
      
      console.log('Python脚本执行完成:', stdout);
      if (stderr) {
        console.error('Python脚本执行错误:', stderr);
      }
      
      // 检查CSV文件是否存在
      if (!fs.existsSync(csvFilePath)) {
        console.log('CSV文件不存在，跳过处理');
        return;
      }
      
      console.log('开始处理CSV文件');
      
      // 解析CSV文件
      const rawData = await this.parseCSVFile(csvFilePath);
      
      // 处理数据
      const jobData = await this.processJobData(rawData);
      
      // 插入数据库
      const result = await this.insertJobs(jobData);
      
      console.log(`CSV文件处理完成: ${result.message}`);
    } catch (error) {
      console.error('处理每日CSV文件失败:', error.message);
    }
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
      const locationFilePath = path.join(__dirname, '../datasource/loccation.json');
      const locationData = JSON.parse(fs.readFileSync(locationFilePath, 'utf8'));
      
      const processedData = [];
      
      for (const item of rawData) {
        // 解析location字段中的C+数字格式
        let location = item.location || "";
        const locationMatch = location.match(/C(\d+)/i);
        if (locationMatch) {
          const locationKey = `c${locationMatch[1].toLowerCase()}`;
          if (locationData[locationKey]) {
            location = locationData[locationKey];
          }
        }
        
        // 处理job_apply_url，去除utm_source=indeed及之后字符
        let jobApplyUrl = item.job_url_direct || "";
        const utmIndex = jobApplyUrl.indexOf('utm_source=indeed');
        if (utmIndex !== -1) {
          jobApplyUrl = jobApplyUrl.substring(0, utmIndex - 1); // -1是为了去掉前面的&
        }
        
        // 处理薪水范围，固定为"面议"
        const salaryRange = "面议";
        
        // 处理公司信息
        const companyName = item.company || "";
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