const express = require('express');
const router = express.Router();
const nhaCungCapController = require('../controllers/nhacungcap.controller');

console.log('NhaCungCap routes loaded');
// Lấy danh sách nhà cung cấp
router.get('/', nhaCungCapController.getAllNhaCungCap);

// Thêm mới nhà cung cấp (gọi thủ tục)
router.post('/', nhaCungCapController.createNhaCungCap);
// Sửa nhà cung cấp (gọi thủ tục)
router.put('/', nhaCungCapController.updateNhaCungCap);
// Xóa nhà cung cấp (gọi thủ tục)
router.delete('/:MaNhaCungCap', nhaCungCapController.deleteNhaCungCap);

module.exports = router;
