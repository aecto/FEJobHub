const sequelize = require('../config/database');
const Job = require('../models/Job');
const User = require('../models/User');
const Visit = require('../models/Visit');
const ExcelParser = require('../services/excelParser');
const path = require('path');
const fs = require('fs');

// 测试数据库连接
async function syncDatabase() {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功');
    
    // 同步模型到数据库
    await sequelize.sync({ alter: true });
    console.log('数据库表同步完成');
  } catch (error) {
    console.error('数据库连接失败:', error);
  }
}

// 创建数据库
async function createDatabase() {
  try {
    // 使用 sequelize 创建数据库
    const { Sequelize } = require('sequelize');
    
    // 先连接到 MySQL 服务器（不指定数据库）
    const tempSequelize = new Sequelize(
      'mysql://' + process.env.DB_USER + ':' + process.env.DB_PASSWORD + '@' + process.env.DB_HOST + ':' + process.env.DB_PORT
    );
    
    // 执行创建数据库的 SQL 语句
    await tempSequelize.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
    console.log('数据库创建成功');
    
    await tempSequelize.close();
  } catch (error) {
    console.error('创建数据库失败:', error);
  }
}

// 导入Excel数据
async function importExcelData() {
  try {
    // 检查数据源目录
    const datasourceDir = path.join(__dirname, '../../datasource');
    if (!fs.existsSync(datasourceDir)) {
      console.log('数据源目录不存在');
      return;
    }
    
    // 查找xlsx文件
    const files = fs.readdirSync(datasourceDir);
    const xlsxFiles = files.filter(file => path.extname(file).toLowerCase() === '.xlsx');
    
    if (xlsxFiles.length === 0) {
      console.log('未找到xlsx文件');
      return;
    }
    
    // 处理每个xlsx文件
    for (const file of xlsxFiles) {
      const filePath = path.join(datasourceDir, file);
      console.log(`正在处理文件: ${file}`);
      
      // 解析Excel文件
      const rawData = ExcelParser.parseFile(filePath);
      console.log(`解析到 ${rawData.length} 条数据`);
      
      // 处理数据
      const processedData = ExcelParser.processJobData(rawData);
      
      // 插入数据库
      const result = await ExcelParser.insertJobs(processedData);
      console.log(result.message);
    }
  } catch (error) {
    console.error('导入Excel数据失败:', error);
  }
}

// 主函数
async function main() {
  // 加载环境变量
  require('dotenv').config({ path: path.join(__dirname, '../.env') });
  
  // 创建数据库
  await createDatabase();
  
  // 等待一段时间确保数据库创建完成
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 重新连接到指定数据库
  const sequelizeWithDB = require('../config/database');
  
  try {
    await sequelizeWithDB.authenticate();
    console.log('数据库连接成功');
    
    // 同步模型到数据库
    await sequelizeWithDB.sync({ alter: true });
    console.log('数据库表同步完成');
    
    // 导入Excel数据
    await importExcelData();
  } catch (error) {
    console.error('操作失败:', error);
  } finally {
    await sequelizeWithDB.close();
  }
}

main();