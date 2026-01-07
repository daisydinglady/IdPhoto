/**
 * 全局错误处理中间件
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Multer 错误
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: '文件大小超过限制，最大支持 10MB'
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      message: '上传文件字段错误'
    });
  }

  // 文件类型错误
  if (err.message && err.message.includes('不支持的文件类型')) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  // Hivision API 错误
  if (err.message && err.message.includes('Hivision API Error')) {
    return res.status(500).json({
      success: false,
      message: '证件照处理失败，请稍后重试',
      error: err.message
    });
  }

  // 默认错误
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

module.exports = errorHandler;
