const XLSX = require('xlsx');
const path = require('path');
const Job = require('../models/Job');
const Company = require('../models/Company');

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
   * 从job_apply_url中提取career_url
   * @param {string} jobApplyUrl - 职位申请链接
   * @returns {string} career_url
   */
  static extractCareerUrl(jobApplyUrl) {
    if (!jobApplyUrl) return null;
    
    // 查找job、jobs或career关键词
    const jobIndex = jobApplyUrl.indexOf('/job/');
    const jobsIndex = jobApplyUrl.indexOf('/jobs/');
    const careerIndex = jobApplyUrl.indexOf('/career/');
    
    // 找到最早出现的关键词
    let earliestIndex = -1;
    let earliestPosition = -1;
    
    if (jobIndex !== -1) {
      earliestIndex = jobIndex;
      earliestPosition = jobIndex + 5; // +5 是为了跳过 '/job/' 部分
    }
    
    if (jobsIndex !== -1 && (earliestIndex === -1 || jobsIndex < earliestIndex)) {
      earliestIndex = jobsIndex;
      earliestPosition = jobsIndex + 6; // +6 是为了跳过 '/jobs/' 部分
    }
    
    if (careerIndex !== -1 && (earliestIndex === -1 || careerIndex < earliestIndex)) {
      earliestIndex = careerIndex;
      earliestPosition = careerIndex + 8; // +8 是为了跳过 '/career/' 部分
    }
    
    if (earliestIndex !== -1) {
      return jobApplyUrl.substring(0, earliestPosition - 1); // -1 是为了去掉最后的斜杠
    }
    
    // 如果没有找到job、jobs或career，则查找.net或.com
    const dotNetIndex = jobApplyUrl.indexOf('.net/');
    const dotComIndex = jobApplyUrl.indexOf('.com/');
    
    // 找到最早出现的域名后缀
    let domainIndex = -1;
    if (dotNetIndex !== -1) domainIndex = dotNetIndex + 4; // +4 是为了包含.net
    if (dotComIndex !== -1 && (domainIndex === -1 || dotComIndex < domainIndex)) domainIndex = dotComIndex + 4; // +4 是为了包含.com
    
    if (domainIndex !== -1) {
      return jobApplyUrl.substring(0, domainIndex);
    }
    
    // 如果都找不到，返回原始URL
    return jobApplyUrl;
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
   * 处理公司数据并插入数据库
   * @param {Array} jobData - 职位数据
   * @returns {Promise} 处理结果
   */
  static async processCompanies(jobData) {
    try {
      for (const job of jobData) {
        const companyName = job.company_name;
        const jobApplyUrl = job.job_apply_url;
        
        // 检查公司是否已存在
        const existingCompany = await Company.findOne({
          where: {
            company_name: companyName
          }
        });
        
        // 如果公司不存在，则创建新记录
        if (!existingCompany) {
          const careerUrl = this.extractCareerUrl(jobApplyUrl);
          await Company.create({
            company_name: companyName,
            career_url: careerUrl
          });
        }
      }
      
      return {
        success: true,
        message: '公司信息处理完成'
      };
    } catch (error) {
      throw new Error(`处理公司信息失败: ${error.message}`);
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
}

module.exports = ExcelParser;