const schedule = require('node-schedule');
const fs = require('fs');
const path = require('path');
const ExcelParser = require('./excelParser');

class CronService {
  /**
   * 启动定时任务
   */
  static startCronJobs() {
    // 每天晚上9点执行文件处理任务
    const dailyJob = schedule.scheduleJob('0 0 21 * * *', async () => {
      console.log('开始执行每日XLSX文件处理任务');
      await CronService.processDailyExcelFile();
    });
    
    // 每天凌晨1点执行过期职位清理任务
    const cleanupJob = schedule.scheduleJob('0 0 1 * * *', async () => {
      console.log('开始执行过期职位清理任务');
      await CronService.cleanupExpiredJobs();
    });
    
    console.log('定时任务已启动');
  }
  
  /**
   * 处理每日XLSX文件
   */
  static async processDailyExcelFile() {
    try {
      // 生成今天的日期文件名
      const today = new Date();
      const dateString = today.toISOString().split('T')[0]; // YYYY-MM-DD格式
      const fileName = `${dateString}.xlsx`;
      const filePath = path.join(process.env.UPLOAD_PATH || './uploads', fileName);
      
      // 检查文件是否存在
      if (!fs.existsSync(filePath)) {
        console.log(`今日文件 ${fileName} 不存在，跳过处理`);
        return;
      }
      
      console.log(`发现今日文件 ${fileName}，开始处理`);
      
      // 解析文件
      const rawData = ExcelParser.parseFile(filePath);
      
      // 处理数据
      const jobData = ExcelParser.processJobData(rawData);
      
      // 插入数据库
      const result = await ExcelParser.insertJobs(jobData);
      
      console.log(`文件处理完成: ${result.message}`);
    } catch (error) {
      console.error('处理每日XLSX文件失败:', error.message);
    }
  }
  
  /**
   * 清理过期职位
   */
  static async cleanupExpiredJobs() {
    try {
      const Job = require('../models/Job');
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