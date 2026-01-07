const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const idphotoRoutes = require('./src/routes/idphoto');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// 路由
app.use('/api/idphoto', idphotoRoutes);

// 错误处理
app.use(errorHandler);

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API base URL: http://localhost:${PORT}/api/idphoto`);
});

module.exports = app;
