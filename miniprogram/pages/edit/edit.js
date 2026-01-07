// pages/edit/edit.js
const api = require('../../utils/api.js');
const storage = require('../../utils/storage.js');
const config = require('../../utils/config.js');

Page({
  data: {
    photoType: {
      name: '',
      width: 0,
      height: 0
    },
    // 原始数据（透明底）
    originalData: {
      standard: '',
      hd: ''
    },
    // 当前显示的图片
    currentImageUrl: '',
    selectedColor: '#4A90E2',
    loading: false
  },

  onLoad(options) {
    const { imageData, width, height, name } = options;

    try {
      const data = JSON.parse(decodeURIComponent(imageData));

      this.setData({
        photoType: {
          name: name || '证件照',
          width: parseInt(width) || 295,
          height: parseInt(height) || 413
        },
        originalData: {
          standard: data.image_base64_standard || data.image_base64 || '',
          hd: data.image_base64_hd || ''
        }
      });

      // 默认选择蓝色背景并预览
      this.selectColor({ currentTarget: { dataset: { color: '#4A90E2' } } });
    } catch (error) {
      wx.showToast({
        title: '数据加载失败',
        icon: 'none'
      });
    }
  },

  /**
   * 预览图片
   */
  previewImage() {
    if (!this.data.currentImageUrl) return;

    wx.previewImage({
      urls: [this.data.currentImageUrl]
    });
  },

  /**
   * 选择背景色
   */
  async selectColor(e) {
    const color = e.currentTarget.dataset.color;
    this.setData({ selectedColor: color });

    // 如果有原始透明底图片，添加背景色预览
    if (this.data.originalData.standard) {
      await this.addBackgroundPreview(color);
    }
  },

  /**
   * 添加背景色预览
   */
  async addBackgroundPreview(color) {
    try {
      console.log('添加背景色，颜色：', color);

      // 检查原始数据是否存在
      if (!this.data.originalData.standard) {
        throw new Error('原始证件照数据不存在');
      }

      // 将 base64 转为临时文件
      const tempFilePath = await storage.saveBase64Image(
        this.data.originalData.standard,
        'transparent_photo.png'
      );

      console.log('临时文件创建成功：', tempFilePath);

      // 调用 API 添加背景色
      const result = await api.changeBackground(tempFilePath, color.replace('#', ''));

      console.log('API 返回结果：', result);

      if (result.success && result.data.image_base64) {
        // 将返回的 base64 转为临时文件用于显示
        const newFilePath = await storage.saveBase64Image(
          result.data.image_base64,
          `photo_bg_${Date.now()}.jpg`
        );

        console.log('新图片创建成功：', newFilePath);

        this.setData({
          currentImageUrl: newFilePath
        });
      } else {
        throw new Error(result.message || '添加背景色失败');
      }
    } catch (error) {
      console.error('添加背景色预览失败：', error);
      wx.showToast({
        title: error.message || '预览失败',
        icon: 'none',
        duration: 2000
      });
    }
  },

  /**
   * 更换背景色（用户主动点击）
   */
  async changeBackground() {
    this.setData({ loading: true });
    wx.showLoading({ title: '处理中...', mask: true });

    try {
      await this.addBackgroundPreview(this.data.selectedColor);
      wx.hideLoading();
      wx.showToast({
        title: '背景色已更换',
        icon: 'success'
      });
    } catch (error) {
      wx.hideLoading();
      wx.showToast({
        title: '更换失败，请重试',
        icon: 'none'
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  /**
   * 生成排版照
   */
  async generateLayout() {
    if (!this.data.currentImageUrl) {
      wx.showToast({
        title: '请先生成证件照',
        icon: 'none'
      });
      return;
    }

    this.setData({ loading: true });
    wx.showLoading({ title: '生成排版照...', mask: true });

    try {
      // 调用 API 生成排版照
      const result = await api.generateLayout(this.data.currentImageUrl, {
        width: this.data.photoType.width,
        height: this.data.photoType.height
      });

      wx.hideLoading();

      if (result.success && result.data.image_base64) {
        // 跳转到预览页面
        // 注意：singleData 传递当前文件路径（字符串），layoutData 传递 base64 对象
        wx.redirectTo({
          url: `/pages/preview/preview?layoutData=${encodeURIComponent(JSON.stringify(result.data))}&singlePath=${encodeURIComponent(this.data.currentImageUrl)}&name=${this.data.photoType.name}`
        });
      } else {
        wx.showToast({
          title: '生成失败，请重试',
          icon: 'none'
        });
      }
    } catch (error) {
      wx.hideLoading();
      wx.showToast({
        title: error.message || '生成失败',
        icon: 'none'
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  /**
   * 重新上传
   */
  reupload() {
    wx.navigateBack();
  },

  /**
   * 保存当前照片
   */
  async saveCurrent() {
    if (!this.data.currentImageUrl) {
      wx.showToast({
        title: '没有可保存的照片',
        icon: 'none'
      });
      return;
    }

    try {
      await storage.saveImageToPhotosAlbum(this.data.currentImageUrl);
      wx.showToast({
        title: '已保存到相册',
        icon: 'success'
      });

      // 保存到历史记录
      storage.saveToHistory({
        photoType: this.data.photoType,
        processedImages: {
          standard: this.data.currentImageUrl
        },
        backgroundColor: this.data.selectedColor
      });
    } catch (error) {
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      });
    }
  }
});
