// routes/admin.routes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

router.get('/users', authMiddleware, requireRole('NhanVien'), adminController.getAllUsers);
router.patch('/users/:MaTaiKhoan/role', authMiddleware, requireRole('NhanVien'), adminController.updateUserRole);
router.patch('/users/:MaTaiKhoan/status', authMiddleware, requireRole('NhanVien'), adminController.updateUserStatus);

module.exports = router;
