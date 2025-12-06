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

exports.searchSanPhamByNCC = async (req, res) => {
	try {
		// Lấy tham số từ query string
		const { tuKhoaTenNCC } = req.query;
		if (!tuKhoaTenNCC) {
			return res.status(400).json({ message: 'Vui lòng nhập từ khóa tìm kiếm' });
		}
		const [results] = await sequelize.query(
			'EXEC proc_TimKiemSanPhamTheoNCC :TuKhoaTenNCC',
			{ replacements: { TuKhoaTenNCC: tuKhoaTenNCC } }
		);
		res.json(results);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

exports.filterSanPham = async (req, res) => {
	try {
		const { minPrice, maxPrice, minRating } = req.query;
		
		let query = 'SELECT * FROM Sanpham WHERE 1=1';
		const replacements = {};
		
		if (minPrice) {
			query += ' AND Gia >= :minPrice';
			replacements.minPrice = parseFloat(minPrice);
		}
		
		if (maxPrice) {
			query += ' AND Gia <= :maxPrice';
			replacements.maxPrice = parseFloat(maxPrice);
		}
		
		if (minRating) {
			query += ' AND DiemDanhGiaTB >= :minRating';
			replacements.minRating = parseFloat(minRating);
		}
		
		query += ' ORDER BY MaSanPham';
		
		const [results] = await sequelize.query(query, { replacements });
		res.json(results);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};