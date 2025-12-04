// controllers/auth.controller.js
const TaiKhoan = require('../models/TaiKhoan');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('../config/database');

exports.register = async (req, res) => {
  try {
    console.log('Register request body:', req.body);
    const { TenTaiKhoan, MatKhau, Email, VaiTro } = req.body;
    // Check duplicate Email or TenTaiKhoan
    const existEmail = await TaiKhoan.findOne({ where: { Email } });
    const existUser = await TaiKhoan.findOne({ where: { TenTaiKhoan } });
    if (existEmail || existUser) {
      console.log('Duplicate email or username:', Email, TenTaiKhoan);
      return res.status(400).json({ message: 'Tài khoản đã tồn tại' });
    }
    // Create user
    const hashedPassword = await bcrypt.hash(MatKhau, 10);
    try {
      await sequelize.query(
        'INSERT INTO TaiKhoan (TenTaiKhoan, MatKhau, Email, VaiTro) VALUES (:TenTaiKhoan, :MatKhau, :Email, :VaiTro)',
        { replacements: { TenTaiKhoan, MatKhau: hashedPassword, Email, VaiTro } }
      )
      const createdUser = await TaiKhoan.findOne({ where: { Email } });
      console.log('User created:', createdUser);
      res.json({ success: true, user: createdUser, message: 'Register successful' });
    } catch (dbErr) {
      console.error('DB error when creating user:', dbErr);
      res.json({ message: dbErr.message });
    }
  } catch (err) {
    console.error('Register error:', err);
    res.json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { Email, MatKhau, TenTaiKhoan } = req.body;
    let user;
    if (Email) {
      user = await TaiKhoan.findOne({ where: { Email } });
    } else if (TenTaiKhoan) {
      user = await TaiKhoan.findOne({ where: { TenTaiKhoan } });
    }
    if (!user) {
      return res.status(401).json({ message: 'Tài khoản không tồn tại hoặc sai thông tin đăng nhập.' });
    }
    if (user.TrangThai === 'NON-ACTIVE') {
      return res.status(403).json({ message: 'Tài khoản đã bị khóa.' });
    }
    const match = await bcrypt.compare(MatKhau, user.MatKhau);
    if (!match) {
      return res.status(401).json({ message: 'Mật khẩu không đúng.' });
    }
    const token = jwt.sign({ MaTaiKhoan: user.MaTaiKhoan, Email: user.Email, VaiTro: user.VaiTro }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    const { MatKhau: _, ...userData } = user.toJSON();
    res.status(200).json({success: true, token, user: userData });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await TaiKhoan.findByPk(req.user.MaTaiKhoan);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { MatKhau: _, ...userData } = user.toJSON();
    res.json(userData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
