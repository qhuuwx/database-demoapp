// routes/content.routes.js
const express = require('express');
const router = express.Router();
const contentController = require('../controllers/content.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

router.get('/', authMiddleware, contentController.getContents);
router.post('/', authMiddleware, requireRole('NhanVien'), contentController.createContent);
router.put('/:id', authMiddleware, requireRole('NhanVien'), contentController.updateContent);
router.delete('/:id', authMiddleware, requireRole('NhanVien'), contentController.deleteContent);

module.exports = router;
