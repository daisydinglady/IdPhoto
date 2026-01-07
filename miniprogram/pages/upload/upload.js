// pages/upload/upload.js
const api = require('../../utils/api.js');
const config = require('../../utils/config.js');

Page({
  data: {
    photoType: {
      name: '',
      width: 0,
      height: 0,
      desc: ''
    },
    imagePath: '',
    loading: false
  },

  onLoad(options) {
    // 获取从上一页传递的参数
    const { sizeId, name, width, height } = options;

    // 根据 sizeId 查找完整的证件照信息
    const allSizes = [
      ...require('../../data/photo-sizes.js').common,
      ...require('../../data/photo-sizes.js').exam,
      ...require('../../data/photo-sizes.js').visa
    ];

    const photoInfo = allSizes.find(item => item.id === sizeId);

    this.setData({
      photoType: {
        name: name || photoInfo?.name || '证件照',
        width: parseInt(width) || photoInfo?.width || 295,
        height: parseInt(height) || photoInfo?.height || 413,
        desc: photoInfo?.desc || ''
      }
    });
  },

  /**
   * 从相册选择图片
   */
  chooseImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];

        // 检查文件大小
        wx.getFileInfo({
          filePath: tempFilePath,
          success: (fileRes) => {
            if (fileRes.size > config.maxImageSize) {
              wx.showToast({
                title: '图片大小不能超过 10MB',
                icon: 'none'
              });
              return;
            }

            this.setData({
              imagePath: tempFilePath
            });
          }
        });
      }
    });
  },

  /**
   * 拍照
   */
  takePhoto() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        this.setData({
          imagePath: tempFilePath
        });
      }
    });
  },

  /**
   * 生成证件照
   */
  async generateIdphoto() {
    if (!this.data.imagePath) {
      wx.showToast({
        title: '请先上传照片',
        icon: 'none'
      });
      return;
    }

    this.setData({ loading: true });

    wx.showLoading({
      title: 'AI 处理中...',
      mask: true
    });

    try {
      // 调用 API 生成证件照
      const result = await api.generateIdphoto(this.data.imagePath, {
        width: this.data.photoType.width,
        height: this.data.photoType.height
      });

      wx.hideLoading();

      if (result.success) {
        // 跳转到编辑页面
        wx.redirectTo({
          url: `/pages/edit/edit?imageData=${encodeURIComponent(JSON.stringify(result.data))}&width=${this.data.photoType.width}&height=${this.data.photoType.height}&name=${this.data.photoType.name}`
        });
      } else {
        wx.showToast({
          title: result.message || '生成失败，请重试',
          icon: 'none'
        });
      }
    } catch (error) {
      wx.hideLoading();
      wx.showToast({
        title: error.message || '网络错误，请重试',
        icon: 'none'
      });
    } finally {
      this.setData({ loading: false });
    }
  }
});
