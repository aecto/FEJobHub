const express = require('express');
const router = express.Router();
const JobController = require('../controllers/jobController');
const { authenticateToken, authorizeAdmin } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 确保datasource目录存在
const datasourceDir = path.join(__dirname, '../../datasource');
if (!fs.existsSync(datasourceDir)) {
  fs.mkdirSync(datasourceDir, { recursive: true });
}

// 配置文件上传
const storage = multer.diskStorage({
  destination: datasourceDir,  // 修改为datasource文件夹
  filename: function (req, file, cb) {
    // 使用原文件名
    cb(null, file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB限制
  },
  fileFilter: function (req, file, cb) {
    // 允许XLSX和CSV文件，通过文件扩展名判断
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (fileExtension === '.xlsx' || fileExtension === '.csv') {
      cb(null, true);
    } else {
      cb(new Error('只支持XLSX和CSV文件格式'));
    }
  }
});

// 公开接口（无需认证）
router.get('/', JobController.getJobs); // 获取职位列表（支持搜索和分页）
router.get('/:id', JobController.getJobById); // 获取职位详情

// 需要认证的接口
router.post('/upload', authenticateToken, authorizeAdmin, upload.single('file'), JobController.uploadFile); // 上传文件

// 管理员接口
router.delete('/:id', authenticateToken, authorizeAdmin, JobController.deleteJob); // 删除职位

module.exports = router;