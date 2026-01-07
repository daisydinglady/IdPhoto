const multer = require('multer');

// 配置存储
const storage = multer.memoryStorage();

// 文件过滤器
const fileFilter = (req, file, cb) => {
  // 检查文件类型
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('不支持的文件类型，仅支持 JPG、JPEG 和 PNG 格式'), false);
  }
};

// 创建 multer 实例
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 限制 10MB
  },
  fileFilter: fileFilter
});

module.exports = upload;
