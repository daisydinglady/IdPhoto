module.exports = {
  // HivisionIDPhotos 服务地址
  // baseURL: process.env.HIVISION_API_URL || 'http://localhost:8080',
  baseURL: process.env.HIVISION_API_URL || 'http://127.0.0.1:8080',

  // 超时时间（毫秒）
  timeout: parseInt(process.env.HIVISION_TIMEOUT) || 30000,

  // API 端点配置
  endpoints: {
    idphoto: '/idphoto',
    addBackground: '/add_background',
    generateLayout: '/generate_layout_photos',
    idphotoCrop: '/idphoto_crop',
    setKB: '/set_kb',
    humanMatting: '/human_matting',
    watermark: '/watermark'
  },

  // 默认参数
  defaults: {
    dpi: 300,
    hd: true,
    faceAlignment: true,
    headMeasureRatio: 0.2,
    headHeightRatio: 0.45,
    topDistanceMax: 0.12,
    topDistanceMin: 0.1,
    brightnessStrength: 0,
    contrastStrength: 0,
    sharpenStrength: 0,
    saturationStrength: 0
  }
};
