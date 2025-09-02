const sequelize = require('../config/database');
const Company = require('../models/Company');

async function queryCompanies() {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功');
    
    // 查询所有公司记录
    const companies = await Company.findAll({
      order: [['id', 'ASC']]
    });
    console.log('公司记录:');
    console.log('====================');
    companies.forEach(company => {
      console.log(`ID: ${company.id}`);
      console.log(`公司名称: ${company.company_name}`);
      console.log(`招聘页面URL: ${company.career_url}`);
      console.log(`创建时间: ${company.createdAt}`);
      console.log(`更新时间: ${company.updatedAt}`);
      console.log('---------------------');
    });
    
    console.log(`总共找到 ${companies.length} 条公司记录`);
  } catch (error) {
    console.error('查询失败:', error);
  } finally {
    await sequelize.close();
  }
}

queryCompanies();