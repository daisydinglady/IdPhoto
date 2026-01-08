// pages/tools/change-bg/change-bg.js
const api = require('../../../utils/api.js');
const storage = require('../../../utils/storage.js');

Page({
  data: {
    imagePath: '',
    selectedColor: '#4A90E2',
    kbValue: '',
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
        this.setData({ imagePath: tempFilePath });
      }
    });
  },

  /**
   * 选择背景色
   */
  selectColor(e) {
    const color = e.currentTarget.dataset.color;
    this.setData({ selectedColor: color });
  },

  /**
   * KB输入
   */
  onKBInput(e) {
    this.setData({ kbValue: e.detail.value });
  },

  /**
   * 预览图片
   */
  previewImage() {
    wx.previewImage({
      urls: [this.data.imagePath]
    });
  },

  /**
   * 更换背景色
   */
  async changeBackground() {
    if (!this.data.imagePath) {
      wx.showToast({ title: '请先上传照片', icon: 'none' });
      return;
    }

    this.setData({ processing: true });
    wx.showLoading({ title: '正在抠图...', mask: true });

    try {
      // 第一步：人像抠图（无论图片是否有背景，都先进行抠图）
      const mattingResult = await api.matting(this.data.imagePath, {
        human_matting_model: 'modnet_photographic_portrait_matting',
        dpi: 300
      });

      if (!mattingResult.success || !mattingResult.data.image_base64) {
        throw new Error(mattingResult.message || '抠图失败');
      }

      // 保存抠图结果到临时文件
      const mattingImagePath = await storage.saveBase64Image(
        mattingResult.data.image_base64,
        `matting-${Date.now()}.png`
      );

      wx.showLoading({ title: '正在添加背景...', mask: true });

      // 第二步：添加背景色
      const color = this.data.selectedColor.replace('#', '');
      const options = {
        render: 0,  // 纯色渲染
        dpi: 300
      };

      // 如果设置了KB值
      if (this.data.kbValue) {
        options.kb = parseInt(this.data.kbValue);
      }

      const result = await api.changeBackground(mattingImagePath, color, options);

      wx.hideLoading();

      if (result.success && result.data.image_base64) {
        // 保存到临时文件并预览
        const filePath = await storage.saveBase64Image(
          result.data.image_base64,
          `change-bg-${Date.now()}.jpg`
        );

        wx.showModal({
          title: '处理成功',
          content: '是否保存到相册？',
          success: (res) => {
            if (res.confirm) {
              this.saveToAlbum(filePath);
            } else {
              this.setData({
                imagePath: filePath,
                processing: false
              });
            }
          }
        });
      } else {
        throw new Error(result.message || '添加背景色失败');
      }
    } catch (error) {
      wx.hideLoading();
      wx.showToast({
        title: error.message || '处理失败',
        icon: 'none'
      });
    } finally {
      this.setData({ processing: false });
    }
  },

  /**
   * 保存到相册
   */
  async saveToAlbum(filePath) {
    try {
      await storage.saveImageToPhotosAlbum(filePath);
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
      selectedColor: '#4A90E2',
      kbValue: '',
      processing: false
    });
  }
});
