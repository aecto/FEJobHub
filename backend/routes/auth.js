const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

// 公开接口
router.post('/register', AuthController.register); // 用户注册
router.post('/login', AuthController.login); // 用户登录

// 需要认证的接口
router.get('/profile', authenticateToken, AuthController.getCurrentUser); // 获取当前用户信息
router.post('/logout', authenticateToken, AuthController.logout); // 用户登出

module.exports = router;