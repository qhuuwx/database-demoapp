const express = require('express');
const router = express.Router();
const SanphamController = require('../controllers/sanpham.controller');
console.log('SanPham routes loaded');
// Lấy danh sách sản phẩm
router.get('/', SanphamController.getAllSanPham);
router.get('/filter', SanphamController.filterSanPham);
router.get('/search-products', SanphamController.searchSanPhamByNCC);
router.get('/search/:TenNhaCungCap', SanphamController.findSanPhamByNCC);
module.exports = router;