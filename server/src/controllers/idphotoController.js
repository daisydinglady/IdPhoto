const hivisionService = require('../services/hivisionService');

// 证件照尺寸数据
const photoSizes = {
  common: [
    { id: 'c1', name: '一寸', width: 295, height: 413, dpi: 300, desc: '25mm × 35mm', category: 'common' },
    { id: 'c2', name: '二寸', width: 413, height: 626, dpi: 300, desc: '35mm × 53mm', category: 'common' },
    { id: 'c3', name: '小二寸', width: 390, height: 567, dpi: 300, desc: '33mm × 48mm', category: 'common' },
    { id: 'c4', name: '五寸', width: 1499, height: 1050, dpi: 300, desc: '127mm × 89mm（横向照片）', category: 'common', isHorizontal: true }
  ],
  exam: [
    { id: 'e1', name: '四六级', width: 295, height: 413, dpi: 300, desc: '一寸照', category: 'exam' },
    { id: 'e2', name: '考研', width: 295, height: 413, dpi: 300, desc: '一寸照', category: 'exam' },
    { id: 'e3', name: '公务员', width: 413, height: 626, dpi: 300, desc: '二寸照', category: 'exam' },
    { id: 'e4', name: '教师资格证', width: 295, height: 413, dpi: 300, desc: '一寸照', category: 'exam' },
    { id: 'e5', name: '会计证', width: 295, height: 413, dpi: 300, desc: '一寸照', category: 'exam' },
    { id: 'e6', name: '计算机等级考试', width: 295, height: 413, dpi: 300, desc: '一寸照', category: 'exam' }
  ],
  visa: [
    { id: 'v1', name: '美国签证', width: 413, height: 531, dpi: 300, desc: '51mm × 51mm', category: 'visa' },
    { id: 'v2', name: '日本签证', width: 413, height: 531, dpi: 300, desc: '45mm × 45mm', category: 'visa' },
    { id: 'v3', name: '韩国签证', width: 413, height: 531, dpi: 300, desc: '35mm × 45mm', category: 'visa' },
    { id: 'v4', name: '申根签证', width: 413, height: 531, dpi: 300, desc: '35mm × 45mm', category: 'visa' },
    { id: 'v5', name: '中国护照', width: 413, height: 626, dpi: 300, desc: '33mm × 48mm', category: 'visa' },
    { id: 'v6', name: '港澳通行证', width: 413, height: 531, dpi: 300, desc: '33mm × 48mm', category: 'visa' }
  ]
};

/**
 * 获取所有证件照尺寸
 */
exports.getSizes = (req, res) => {
  try {
    const allSizes = [...photoSizes.common, ...photoSizes.exam, ...photoSizes.visa];
    res.json({
      success: true,
      data: allSizes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取证件照尺寸失败'
    });
  }
};

/**
 * 生成证件照
 */
exports.generateIdphoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '请上传照片'
      });
    }

    const { width, height, ...options } = req.body;

    const result = await hivisionService.generateIdphoto(req.file.buffer, {
      width: width ? parseInt(width) : undefined,
      height: height ? parseInt(height) : undefined,
      ...options
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '生成证件照失败',
      error: error.message
    });
  }
};

/**
 * 更换背景色
 */
exports.changeBackground = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '请上传照片'
      });
    }

    const { color, ...options } = req.body;

    const result = await hivisionService.addBackground(req.file.buffer, color, options);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更换背景色失败',
      error: error.message
    });
  }
};

/**
 * 生成排版照
 */
exports.generateLayout = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '请上传照片'
      });
    }

    const { width, height, ...options } = req.body;

    const result = await hivisionService.generateLayout(req.file.buffer, {
      width: width ? parseInt(width) : undefined,
      height: height ? parseInt(height) : undefined,
      ...options
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '生成排版照失败',
      error: error.message
    });
  }
};

/**
 * 调整证件照参数
 */
exports.adjustIdphoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '请上传照片'
      });
    }

    const options = req.body;

    const result = await hivisionService.cropIdphoto(req.file.buffer, options);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '调整证件照失败',
      error: error.message
    });
  }
};

/**
 * 调整 KB 大小
 */
exports.resizeKB = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '请上传照片'
      });
    }

    const { kb } = req.body;

    if (!kb) {
      return res.status(400).json({
        success: false,
        message: '请指定目标 KB 大小'
      });
    }

    const result = await hivisionService.setKB(req.file.buffer, parseInt(kb), req.body);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '调整 KB 大小失败',
      error: error.message
    });
  }
};

/**
 * 人像抠图
 */
exports.matting = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '请上传照片'
      });
    }

    const result = await hivisionService.humanMatting(req.file.buffer, req.body);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '人像抠图失败',
      error: error.message
    });
  }
};

/**
 * 添加水印
 */
exports.watermark = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '请上传照片'
      });
    }

    const { text, ...options } = req.body;

    const result = await hivisionService.watermark(req.file.buffer, text || '证件照', options);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '添加水印失败',
      error: error.message
    });
  }
};
