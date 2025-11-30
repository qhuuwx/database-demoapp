// models/TaiKhoan.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

class TaiKhoan extends Model { }

TaiKhoan.init({
  MaTaiKhoan: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: true,
    comment: 'Mã tài khoản dạng ACC0001, ACC0002...'
  },
  TenTaiKhoan: {
    type: DataTypes.STRING,
    allowNull: false
  },
  MatKhau: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Lưu password đã hash bằng bcrypt'
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  TrangThai: {
    type: DataTypes.STRING,
    defaultValue: 'ACTIVE',
    comment: "Trạng thái tài khoản: 'ACTIVE', 'NON-ACTIVE'"
  },
  NgayTao: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  VaiTro: {
    type: DataTypes.STRING,
    defaultValue: 'KhachHang',
    validate: {
      isIn: [['NhanVien', 'KhachHang']]
    },
    comment: "Phân quyền:'NhanVien', 'KhachHang'"
  }
}, {
  sequelize,
  modelName: 'TaiKhoan',
  tableName: 'TaiKhoan',
  timestamps: false
});

// Hash password before save
TaiKhoan.beforeCreate(async (user, options) => {
  if (user.MatKhau) {
    const salt = await bcrypt.genSalt(10);
    user.MatKhau = await bcrypt.hash(user.MatKhau, salt);
  }
});

module.exports = TaiKhoan;
