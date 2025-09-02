const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const { authenticateToken, authorizeAdmin } = require('../middleware/authMiddleware');

// 所有管理员接口都需要管理员权限
router.use(authenticateToken, authorizeAdmin);

// 用户管理
router.get('/users', AdminController.getUsers); // 获取用户列表
router.delete('/users/:id', AdminController.deleteUser); // 删除用户

// 职位管理
router.delete('/jobs/:id', AdminController.deleteJob); // 删除职位（已在jobs路由中实现，这里作为示例）

// 仪表板
router.get('/dashboard', AdminController.getDashboardData); // 获取仪表板数据

module.exports = router;