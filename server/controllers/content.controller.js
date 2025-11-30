// controllers/content.controller.js
const Content = require('../models/Content');

exports.getContents = async (req, res) => {
  try {
    const contents = await Content.findAll();
    res.json(contents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createContent = async (req, res) => {
  try {
    const { Title, Body } = req.body;
    const CreatedBy = req.user.MaTaiKhoan;
    const content = await Content.create({ Title, Body, CreatedBy });
    res.json({ message: 'Content created', content });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateContent = async (req, res) => {
  try {
    const { id } = req.params;
    const content = await Content.findByPk(id);
    if (!content) return res.status(404).json({ message: 'Content not found' });
    // Only admin or staff who created can edit
    if (req.user.VaiTro === 'NhanVien' && content.CreatedBy === req.user.MaTaiKhoan) {
      content.Title = req.body.Title || content.Title;
      content.Body = req.body.Body || content.Body;
      content.UpdatedAt = new Date();
      await content.save();
      res.json({ message: 'Content updated', content });
    } else {
      res.status(403).json({ message: 'Forbidden' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteContent = async (req, res) => {
  try {
    const { id } = req.params;
    const content = await Content.findByPk(id);
    if (!content) return res.status(404).json({ message: 'Content not found' });
    // Only admin can delete
    if (req.user.VaiTro === 'NhanVien') {
      await content.destroy();
      res.json({ message: 'Content deleted' });
    } else {
      res.status(403).json({ message: 'Forbidden' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
