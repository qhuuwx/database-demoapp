// controllers/admin.controller.js
const TaiKhoan = require('../models/TaiKhoan');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await TaiKhoan.findAll({
      attributes: ['MaTaiKhoan', 'TenTaiKhoan', 'Email', 'VaiTro', 'TrangThai', 'NgayTao']
    });
      res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { MaTaiKhoan } = req.params;
    const { VaiTro } = req.body;
      if (!['NhanVien', 'KhachHang'].includes(VaiTro)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    // Prevent admin from removing own admin role
      if (MaTaiKhoan === req.user.MaTaiKhoan && VaiTro !== 'NhanVien') {
      return res.status(400).json({ message: 'Cannot remove own admin role' });
    }
    const user = await TaiKhoan.findByPk(MaTaiKhoan);
    if (!user) return res.status(404).json({ message: 'User not found' });
      user.VaiTro = VaiTro;
    await user.save();
    res.json({ message: 'Cập nhật vai trò mới', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { MaTaiKhoan } = req.params;
    const { TrangThai } = req.body;
    if (!['ACTIVE', 'NON-ACTIVE'].includes(TrangThai)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const user = await TaiKhoan.findByPk(MaTaiKhoan);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.TrangThai = TrangThai;
    await user.save();
    res.json({ message: 'Status updated', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
