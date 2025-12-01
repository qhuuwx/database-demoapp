// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const TaiKhoan = require('./models/TaiKhoan');
const Content = require('./models/Content');

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true })); // CORS config

// Import routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/contents', require('./routes/content.routes'));
app.use('/api/nhacungcap', require('./routes/nhacungcap.routes'));
app.use('/api/sanpham', require('./routes/sanpham.routes.js'));

// Sync DB (not recommended in production)
sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(5000, () => {
    console.log('Server running on port 5000');
  });
}).catch(err => {
  console.error('DB sync error:', err);
});

// Note: Do NOT use sequelize.sync() in production. Use migrations instead.
