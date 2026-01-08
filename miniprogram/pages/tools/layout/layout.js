// pages/tools/layout/layout.js
const api = require('../../../utils/api.js');
const storage = require('../../../utils/storage.js');
const photoSizes = require('../../../data/photo-sizes.js');

Page({
  data: {
    imagePath: '',
    selectedSize: photoSizes.common[0], // 默认选择一寸
    commonSizes: photoSizes.common,
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
   * 选择尺寸
   */
  selectSize(e) {
    const size = e.currentTarget.dataset.size;
    this.setData({ selectedSize: size });
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
   * 生成排版照
   */
  async generateLayout() {
    if (!this.data.imagePath) {
      wx.showToast({ title: '请先上传照片', icon: 'none' });
      return;
    }

    this.setData({ processing: true });
    wx.showLoading({ title: '处理中...', mask: true });

    try {
      const options = {
        width: this.data.selectedSize.width,
        height: this.data.selectedSize.height
      };

      // 如果设置了KB值
      if (this.data.kbValue) {
        options.kb = parseInt(this.data.kbValue);
      }

      const result = await api.generateLayout(this.data.imagePath, options);

      wx.hideLoading();

      if (result.success && result.data.image_base64) {
        // 保存到临时文件并预览
        const filePath = await storage.saveBase64Image(
          result.data.image_base64,
          `layout-${Date.now()}.jpg`
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
        throw new Error(result.message || '处理失败');
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
      selectedSize: photoSizes.common[0],
      kbValue: '',
      processing: false
    });
  }
});
