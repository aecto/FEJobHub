const { Sequelize } = require('sequelize');
require('dotenv').config();

// 从环境变量获取数据库配置
const sequelize = new Sequelize(
  process.env.DB_NAME || 'fejobhub',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false, // 设置为true可以查看SQL日志
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize;