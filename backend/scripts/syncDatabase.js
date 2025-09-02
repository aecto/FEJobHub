const sequelize = require('../config/database');
const Job = require('../models/Job');
const User = require('../models/User');

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
  } finally {
    await sequelize.close();
  }
}

syncDatabase();