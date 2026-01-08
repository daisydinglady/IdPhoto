// utils/api.js
const config = require('./config.js');

/**
 * 封装微信请求
 */
function request(options) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${config.apiBaseURL}${options.url}`,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'content-type': options.contentType || 'application/json',
        ...options.header
      },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else {
          reject({
            statusCode: res.statusCode,
            message: res.data?.message || '请求失败'
          });
        }
      },
      fail: (err) => {
        reject({
          message: err.errMsg || '网络请求失败'
        });
      }
    });
  });
}

/**
 * 封装微信上传文件
 */
function uploadFile(filePath, formData = {}) {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: `${config.apiBaseURL}${formData.url}`,
      filePath: filePath,
      name: formData.name || 'file',
      formData: formData.data || {},
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const data = JSON.parse(res.data);
          resolve(data);
        } else {
          reject({
            statusCode: res.statusCode,
            message: '上传失败'
          });
        }
      },
      fail: (err) => {
        reject({
          message: err.errMsg || '上传失败'
        });
      }
    });
  });
}

// API 方法集合
const api = {
  /**
   * 获取所有证件照尺寸
   */
  getSizes() {
    return request({
      url: config.api.getSizes,
      method: 'GET'
    });
  },

  /**
   * 生成证件照
   * @param {String} filePath 图片本地路径
   * @param {Object} options 参数
   */
  generateIdphoto(filePath, options = {}) {
    return uploadFile(filePath, {
      url: config.api.generate,
      name: 'input_image',
      data: options
    });
  },

  /**
   * 更换背景色
   * @param {String} filePath 图片本地路径
   * @param {String} color 背景色
   * @param {Object} options 其他参数
   */
  changeBackground(filePath, color, options = {}) {
    return uploadFile(filePath, {
      url: config.api.changeBackground,
      name: 'input_image',
      data: {
        color,
        ...options
      }
    });
  },

  /**
   * 生成排版照
   * @param {String} filePath 图片本地路径
   * @param {Object} options 参数
   */
  generateLayout(filePath, options = {}) {
    return uploadFile(filePath, {
      url: config.api.generateLayout,
      name: 'input_image',
      data: options
    });
  },

  /**
   * 调整证件照
   * @param {String} filePath 图片本地路径
   * @param {Object} options 参数
   */
  adjustIdphoto(filePath, options = {}) {
    return uploadFile(filePath, {
      url: config.api.adjust,
      name: 'input_image',
      data: options
    });
  },

  /**
   * 调整 KB 大小
   * @param {String} filePath 图片本地路径
   * @param {Number} kb 目标 KB 大小
   */
  resizeKB(filePath, kb) {
    return uploadFile(filePath, {
      url: config.api.resizeKB,
      name: 'input_image',
      data: { kb }
    });
  },

  /**
   * 人像抠图
   * @param {String} filePath 图片本地路径
   * @param {Object} options 参数
   */
  matting(filePath, options = {}) {
    return uploadFile(filePath, {
      url: config.api.matting,
      name: 'input_image',
      data: options
    });
  },

  /**
   * 添加水印
   * @param {String} filePath 图片本地路径
   * @param {String} text 水印文字
   * @param {Object} options 参数
   */
  addWatermark(filePath, text, options = {}) {
    return uploadFile(filePath, {
      url: config.api.watermark,
      name: 'input_image',
      data: {
        text,
        ...options
      }
    });
  }
};

module.exports = api;
