// config.js
const config = {
  // 后端 API 地址
  // 开发环境：http://localhost:3000
  // 生产环境：需要配置为实际的域名（必须 HTTPS）
  apiBaseURL: 'http://localhost:3000',

  // API 端点
  api: {
    // 获取证件照尺寸列表
    getSizes: '/api/idphoto/sizes',
    // 生成证件照
    generate: '/api/idphoto/generate',
    // 更换背景色
    changeBackground: '/api/idphoto/change-bg',
    // 生成排版照
    generateLayout: '/api/idphoto/layout',
    // 调整证件照
    adjust: '/api/idphoto/adjust',
    // 调整 KB
    resizeKB: '/api/idphoto/resize-kb',
    // 人像抠图
    matting: '/api/idphoto/matting'
  },

  // 历史记录最大数量
  maxHistoryCount: 20,

  // 图片上传大小限制（字节）10MB
  maxImageSize: 10 * 1024 * 1024,

  // 背景色配置
  colors: {
    blue: '#4A90E2',
    white: '#FFFFFF',
    red: '#FF6B6B',
    gray: '#E0E0E0',
    lightBlue: '#E6F3FF'
  },

  // 广告配置（需要在微信后台申请）
  ad: {
    // 激励视频广告单元 ID
    rewardVideoAdUnitId: '',
    // 是否启用广告
    enabled: false
  }
};

module.exports = config;
