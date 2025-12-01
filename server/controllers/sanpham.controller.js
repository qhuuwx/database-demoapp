const sequelize = require('../config/database');

exports.getAllSanPham = async (req, res) => {
	try {
		const [results] = await sequelize.query('SELECT * FROM Sanpham');
		res.json(results);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
exports.findSanPhamByNCC = async (req, res) => {
	try {
		// Lấy tham số từ URL
		const TenNhaCungCap = req.params.TenNhaCungCap;
		const [results] = await sequelize.query(
			'EXEC proc_TimKiemSanPhamTheoNCC :TuKhoaTenNCC',
			{ replacements: { TuKhoaTenNCC: TenNhaCungCap } }
		);
		res.json(results);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};