// pages/tools/crop/crop.js
const api = require('../../../utils/api.js');
const storage = require('../../../utils/storage.js');
const photoSizes = require('../../../data/photo-sizes.js');

Page({
  data: {
    imagePath: '',
    resultPath: '',
    activeCategory: 'common',
    selectedSize: null,
    currentSizes: photoSizes.common,
    allSizes: photoSizes,
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
          selectedSize: photoSizes.common[0]
        });
      }
    });
  },

  /**
   * 切换分类
   */
  switchCategory(e) {
    const category = e.currentTarget.dataset.category;
    const sizes = this.data.allSizes[category];

    this.setData({
      activeCategory: category,
      currentSizes: sizes,
      selectedSize: sizes[0]
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
   * 处理裁剪
   */
  async processCrop() {
    if (!this.data.imagePath) {
      wx.showToast({ title: '请先上传照片', icon: 'none' });
      return;
    }

    if (!this.data.selectedSize) {
      wx.showToast({ title: '请选择证件照尺寸', icon: 'none' });
      return;
    }

    this.setData({ processing: true });
    wx.showLoading({ title: '裁剪中...', mask: true });

    try {
      const options = {
        width: this.data.selectedSize.width,
        height: this.data.selectedSize.height
      };

      const result = await api.adjustIdphoto(this.data.imagePath, options);

      wx.hideLoading();

      // 检查返回的数据
      if (result.success && result.data) {
        // 优先使用标准尺寸，如果没有则使用高清尺寸
        const imageBase64 = result.data.image_base64_standard || result.data.image_base64_hd;

        if (!imageBase64) {
          throw new Error('未返回有效的图片数据');
        }

        // 保存到临时文件
        const filePath = await storage.saveBase64Image(
          imageBase64,
          `crop-${Date.now()}.png`
        );

        this.setData({
          resultPath: filePath,
          processing: false
        });

        wx.showToast({
          title: '裁剪成功',
          icon: 'success'
        });
      } else {
        throw new Error(result.message || '裁剪失败');
      }
    } catch (error) {
      wx.hideLoading();
      wx.showToast({
        title: error.message || '裁剪失败',
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
      selectedSize: photoSizes.common[0],
      activeCategory: 'common',
      currentSizes: photoSizes.common,
      processing: false
    });
  }
});
