const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

// 用户注册
router.post('/register', AuthController.register);

// 用户登录
router.post('/login', AuthController.login);

// 管理员登录
router.post('/admin-login', AuthController.adminLogin);

// 获取当前用户信息（需要认证）
router.get('/profile', AuthController.getCurrentUser);

// 用户登出
router.post('/logout', AuthController.logout);

module.exports = router;