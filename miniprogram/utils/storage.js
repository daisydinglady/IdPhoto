// utils/storage.js
const config = require('./config.js');

const STORAGE_KEYS = {
  HISTORY: 'idphoto_history'
};

/**
 * 本地存储工具类
 */
const storage = {
  /**
   * 保存到历史记录
   * @param {Object} record 证件照记录
   */
  saveToHistory(record) {
    try {
      let history = this.getHistory();

      // 添加新记录
      history.unshift({
        ...record,
        id: this.generateId(),
        timestamp: Date.now()
      });

      // 限制历史记录数量
      if (history.length > config.maxHistoryCount) {
        history = history.slice(0, config.maxHistoryCount);
      }

      wx.setStorageSync(STORAGE_KEYS.HISTORY, history);
      return true;
    } catch (error) {
      console.error('保存历史记录失败：', error);
      return false;
    }
  },

  /**
   * 获取历史记录
   */
  getHistory() {
    try {
      return wx.getStorageSync(STORAGE_KEYS.HISTORY) || [];
    } catch (error) {
      console.error('获取历史记录失败：', error);
      return [];
    }
  },

  /**
   * 清空历史记录
   */
  clearHistory() {
    try {
      wx.removeStorageSync(STORAGE_KEYS.HISTORY);
      return true;
    } catch (error) {
      console.error('清空历史记录失败：', error);
      return false;
    }
  },

  /**
   * 删除单条历史记录
   * @param {String} id 记录 ID
   */
  deleteHistoryItem(id) {
    try {
      let history = this.getHistory();
      history = history.filter(item => item.id !== id);
      wx.setStorageSync(STORAGE_KEYS.HISTORY, history);
      return true;
    } catch (error) {
      console.error('删除历史记录失败：', error);
      return false;
    }
  },

  /**
   * 生成唯一 ID
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  /**
   * 将 base64 图片保存为临时文件
   * @param {String} base64Data base64 数据
   * @param {String} fileName 文件名
   */
  saveBase64Image(base64Data, fileName = 'photo.jpg') {
    return new Promise((resolve, reject) => {
      try {
        const fsm = wx.getFileSystemManager();
        const filePath = `${wx.env.USER_DATA_PATH}/${fileName}`;

        // 检查 base64 数据是否有效
        if (!base64Data || typeof base64Data !== 'string') {
          reject(new Error('Invalid base64 data'));
          return;
        }

        // 移除可能的前缀（data:image/xxx;base64,）
        let base64 = base64Data;
        if (base64Data.includes(',')) {
          base64 = base64Data.split(',')[1];
        } else if (base64Data.includes(';base64,')) {
          base64 = base64Data.replace(/^data:image\/\w+;base64,/, '');
        }

        // 清理可能的空白字符
        base64 = base64.trim();

        // 验证 base64 字符串（只包含 base64 字符）
        if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64)) {
          reject(new Error('Invalid base64 format'));
          return;
        }

        // 转换为 ArrayBuffer
        const buffer = wx.base64ToArrayBuffer(base64);

        fsm.writeFile({
          filePath,
          data: buffer,
          encoding: 'binary',
          success: () => resolve(filePath),
          fail: (err) => {
            console.error('写入文件失败：', err);
            reject(err);
          }
        });
      } catch (error) {
        console.error('saveBase64Image 错误：', error);
        reject(error);
      }
    });
  },

  /**
   * 保存图片到相册
   * @param {String} filePath 图片路径
   */
  saveImageToPhotosAlbum(filePath) {
    return new Promise((resolve, reject) => {
      wx.saveImageToPhotosAlbum({
        filePath,
        success: () => resolve(),
        fail: (err) => {
          // 如果用户拒绝授权，引导用户开启权限
          if (err.errMsg.includes('auth')) {
            wx.showModal({
              title: '提示',
              content: '需要您授权保存图片到相册',
              success: (res) => {
                if (res.confirm) {
                  wx.openSetting();
                }
                reject(err);
              }
            });
          } else {
            reject(err);
          }
        }
      });
    });
  }
};

module.exports = storage;
