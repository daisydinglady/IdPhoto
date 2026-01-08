// pages/tools/matting/matting.js
const api = require('../../../utils/api.js');
const storage = require('../../../utils/storage.js');

Page({
  data: {
    imagePath: '',
    resultPath: '',
    processing: false
  },

  /**
   * 选择图片
   */
  chooseImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        this.setData({
          imagePath: tempFilePath,
          resultPath: ''
        });
      }
    });
  },

  /**
   * 预览原始图片
   */
  previewImage() {
    wx.previewImage({
      urls: [this.data.imagePath]
    });
  },

  /**
   * 预览结果图片
   */
  previewResult() {
    wx.previewImage({
      urls: [this.data.resultPath]
    });
  },

  /**
   * 处理抠图
   */
  async processMatting() {
    if (!this.data.imagePath) {
      wx.showToast({ title: '请先上传照片', icon: 'none' });
      return;
    }

    this.setData({ processing: true });
    wx.showLoading({ title: 'AI抠图中...', mask: true });

    try {
      const result = await api.matting(this.data.imagePath);

      wx.hideLoading();

      if (result.success && result.data.image_base64) {
        // 保存到临时文件
        const filePath = await storage.saveBase64Image(
          result.data.image_base64,
          `matting-${Date.now()}.png`
        );

        this.setData({
          resultPath: filePath,
          processing: false
        });

        wx.showToast({
          title: '抠图成功',
          icon: 'success'
        });
      } else {
        throw new Error(result.message || '抠图失败');
      }
    } catch (error) {
      wx.hideLoading();
      wx.showToast({
        title: error.message || '抠图失败',
        icon: 'none'
      });
      this.setData({ processing: false });
    }
  },

  /**
   * 保存到相册
   */
  async saveToAlbum() {
    if (!this.data.resultPath) {
      wx.showToast({ title: '没有可保存的图片', icon: 'none' });
      return;
    }

    try {
      await storage.saveImageToPhotosAlbum(this.data.resultPath);
      wx.showToast({
        title: '已保存到相册',
        icon: 'success'
      });
    } catch (error) {
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      });
    }
  },

  /**
   * 重置
   */
  reset() {
    this.setData({
      imagePath: '',
      resultPath: '',
      processing: false
    });
  }
});
