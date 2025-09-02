const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const CronService = require('./services/cronService');

// 加载环境变量
dotenv.config();

// 创建Express应用
const app = express();
const PORT = process.env.PORT || 3000;

// 确保上传目录存在
const fs = require('fs');
const path = require('path');
const uploadDir = process.env.UPLOAD_PATH || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 访问记录中间件
const recordVisit = require('./middleware/visitMiddleware');
app.use(recordVisit);

// 静态文件服务
app.use('/uploads', express.static(uploadDir));

// 基本路由
app.get('/', (req, res) => {
  res.json({ message: '外企招聘平台API服务' });
});

// API路由
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/admin', require('./routes/admin'));

// 数据库连接和同步
sequelize.authenticate()
  .then(() => {
    console.log('数据库连接成功');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('数据库表同步完成');
  })
  .catch(err => {
    console.error('数据库连接失败:', err);
  });

// 启动定时任务
CronService.startCronJobs();

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});

module.exports = app;