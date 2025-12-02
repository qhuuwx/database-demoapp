const express = require('express');
const router = express.Router();
const nhaCungCapController = require('../controllers/nhacungcap.controller');

console.log('NhaCungCap routes loaded');
// Lấy danh sách nhà cung cấp
router.get('/', nhaCungCapController.getAllNhaCungCap);

// Tìm kiếm nhà cung cấp theo khu vực (query string)
router.get('/search-products', nhaCungCapController.searchNCCByArea);

// Thêm mới nhà cung cấp (gọi thủ tục)
router.post('/', nhaCungCapController.createNhaCungCap);
// Sửa nhà cung cấp (gọi thủ tục)
router.put('/', nhaCungCapController.updateNhaCungCap);
// Xóa nhà cung cấp (gọi thủ tục)
router.delete('/:MaNhaCungCap', nhaCungCapController.deleteNhaCungCap);
// Thống kê nhà cung cấp theo khu vực và số lượng tối thiểu (truyền qua query string)
router.get('/thongke/:TinhThanhPho', nhaCungCapController.findNhaCungCapByArea);

module.exports = router;
