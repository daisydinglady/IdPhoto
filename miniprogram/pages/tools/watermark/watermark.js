// pages/tools/watermark/watermark.js
const api = require('../../../utils/api.js');
const storage = require('../../../utils/storage.js');

Page({
  data: {
    imagePath: '',
    resultPath: '',
    watermarkText: '',
    opacity: 50,
    fontSize: 30,
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
          resultPath: '',
          watermarkText: ''
        });
      }
    });
  },

  /**
   * 水印文字输入
   */
  onTextInput(e) {
    this.setData({ watermarkText: e.detail.value });
  },

  /**
   * 选择预设文字
   */
  selectPreset(e) {
    const text = e.currentTarget.dataset.text;
    this.setData({ watermarkText: text });
  },

  /**
   * 透明度变化
   */
  onOpacityChange(e) {
    this.setData({ opacity: e.detail.value });
  },

  /**
   * 字体大小变化
   */
  onFontSizeChange(e) {
    this.setData({ fontSize: e.detail.value });
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
   * 添加水印
   */
  async addWatermark() {
    if (!this.data.imagePath) {
      wx.showToast({ title: '请先上传照片', icon: 'none' });
      return;
    }

    if (!this.data.watermarkText) {
      wx.showToast({ title: '请输入水印文字', icon: 'none' });
      return;
    }

    this.setData({ processing: true });
    wx.showLoading({ title: '处理中...', mask: true });

    try {
      const options = {
        opacity: this.data.opacity / 100,
        size: this.data.fontSize
      };

      const result = await api.addWatermark(this.data.imagePath, this.data.watermarkText, options);

      wx.hideLoading();

      if (result.success && result.data.image_base64) {
        // 保存到临时文件
        const filePath = await storage.saveBase64Image(
          result.data.image_base64,
          `watermark-${Date.now()}.jpg`
        );

        this.setData({
          resultPath: filePath,
          processing: false
        });

        wx.showToast({
          title: '添加成功',
          icon: 'success'
        });
      } else {
        throw new Error(result.message || '添加水印失败');
      }
    } catch (error) {
      wx.hideLoading();
      wx.showToast({
        title: error.message || '添加水印失败',
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
      watermarkText: '',
      opacity: 50,
      fontSize: 30,
      processing: false
    });
  }
});
