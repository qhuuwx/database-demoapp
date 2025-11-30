const sequelize = require('../config/database');

// Lấy danh sách nhà cung cấp
exports.getAllNhaCungCap = async (req, res) => {
	try {
		const [results] = await sequelize.query('SELECT * FROM NhaCungCap');
		res.json(results);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Thêm mới nhà cung cấp (gọi thủ tục)
exports.createNhaCungCap = async (req, res) => {
	try {
		console.log('Request body for creating NhaCungCap:', req.body);
		const { Ten, Email, Duong, PhuongXa, TinhThanhPho, SoDienThoai } = req.body;
		await sequelize.query(
			'EXEC proc_ThemNhaCungCap :Ten, :Email, :Duong, :PhuongXa, :TinhThanhPho, :SoDienThoai',
			{
				replacements: { Ten, Email, Duong, PhuongXa, TinhThanhPho, SoDienThoai }
			}
		);
		res.json({ message: 'Thêm nhà cung cấp thành công' });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
// Sửa nhà cung cấp (gọi thủ tục)
exports.updateNhaCungCap = async (req, res) => {
	console.log('Request body for updating NhaCungCap:', req.body);
	try {
		const {ID, Ten, Email, Duong,PhuongXa, TinhThanhPho, SoDienThoai } = req.body;
		await sequelize.query(
			'EXEC proc_SuaNhaCungCap :ID, :Ten, :Email, :Duong, :PhuongXa, :TinhThanhPho, :SoDienThoai',
			{
				replacements: {ID, Ten, Email, Duong, PhuongXa, TinhThanhPho, SoDienThoai }
			}
		);
		console.log('Update executed successfully');
		res.json({ message: 'Sửa nhà cung cấp thành công' });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
exports.deleteNhaCungCap = async (req, res) => {
	console.log('Request params for deleting NhaCungCap:', req.params);
	try {
		const { MaNhaCungCap } = req.params;
		await sequelize.query('EXEC proc_XoaNhaCungCap :MaNhaCungCap', {
			replacements: { MaNhaCungCap }
		});
		res.json({ message: 'Xóa nhà cung cấp thành công' });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};