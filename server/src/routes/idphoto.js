const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const idphotoController = require('../controllers/idphotoController');

// 获取所有证件照尺寸
router.get('/sizes', idphotoController.getSizes);

// 生成证件照
router.post('/generate', upload.single('input_image'), idphotoController.generateIdphoto);

// 更换背景色
router.post('/change-bg', upload.single('input_image'), idphotoController.changeBackground);

// 生成排版照
router.post('/layout', upload.single('input_image'), idphotoController.generateLayout);

// 调整证件照参数
router.post('/adjust', upload.single('input_image'), idphotoController.adjustIdphoto);

// 调整 KB 大小
router.post('/resize-kb', upload.single('input_image'), idphotoController.resizeKB);

// 人像抠图
router.post('/matting', upload.single('input_image'), idphotoController.matting);

module.exports = router;
