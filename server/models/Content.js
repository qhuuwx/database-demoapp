// models/Content.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Content extends Model {}

Content.init({
  Id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  Title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Body: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  CreatedBy: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'MaTaiKhoan của người tạo, FK tới TaiKhoan'
  },
  UpdatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Content',
  tableName: 'Content',
  timestamps: false
});

module.exports = Content;
