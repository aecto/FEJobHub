const XLSX = require('xlsx');
const path = require('path');
const Job = require('../models/Job');

class ExcelParser {
  /**
   * 解析XLSX文件并返回数据
   * @param {string} filePath - XLSX文件路径
   * @returns {Array} 解析后的数据数组
   */
  static parseFile(filePath) {
    try {
      // 读取工作簿
      const workbook = XLSX.readFile(filePath);
      
      // 获取第一个工作表
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // 将工作表转换为JSON
      const data = XLSX.utils.sheet_to_json(worksheet);
      
      return data;
    } catch (error) {
      throw new Error(`解析XLSX文件失败: ${error.message}`);
    }
  }
  
  /**
   * 处理职位数据并准备插入数据库
   * @param {Array} rawData - 原始数据
   * @returns {Array} 处理后的数据
   */
  static processJobData(rawData) {
    const currentDate = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(currentDate.getDate() + 60); // 60天后过期
    
    return rawData.map(item => {
      // 处理薪水范围，如果为空则设置为"面议"
      const salaryRange = item.salary_range || item.SalaryRange || "面议";
      
      // 提取技能关键词（简单的实现，实际可能需要更复杂的处理）
      let skills = "";
      if (item.requirements) {
        // 简单提取可能的技能关键词
        const skillMatches = item.requirements.match(/(Python|Java|JavaScript|React|Vue|Angular|Node\.js|SQL|MongoDB|AWS|Docker|Kubernetes)/gi);
        if (skillMatches) {
          skills = skillMatches.join(', ');
        }
      }
      
      return {
        title: item.title || item.Title || "",
        company_name: item.company_name || item.Company || "",
        location: item.location || item.Location || "",
        salary_range: salaryRange,
        skills: skills,
        description: item.description || item.Description || "",
        requirements: item.requirements || item.Requirements || "",
        job_apply_url: item.job_apply_url || item.ApplyURL || "",
        created_at: currentDate,
        expires_at: expiryDate,
        status: 'active'
      };
    });
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
}

module.exports = ExcelParser;