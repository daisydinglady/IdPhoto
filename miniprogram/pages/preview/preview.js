// pages/preview/preview.js
const storage = require('../../utils/storage.js');
const config = require('../../utils/config.js');

let rewardVideoAd = null;

Page({
  data: {
    currentView: 'single', // single 或 layout
    singleImageUrl: '',
    layoutImageUrl: '',
    photoType: {
      name: ''
    },
    hasWatchedAd: false,
    adEnabled: config.ad.enabled,
    adUnitId: config.ad.rewardVideoAdUnitId
  },

  onLoad(options) {
    const { layoutData, singleData, name } = options;

    this.setData({
      photoType: { name: name || '证件照' }
    });

    // 处理单张证件照
    if (singleData) {
      try {
        const single = JSON.parse(decodeURIComponent(singleData));
        // 如果是 base64，转换为临时文件
        if (single.image_base64) {
          this.loadSingleImage(single.image_base64);
        } else if (typeof single === 'string' && single.startsWith('http')) {
          this.setData({ singleImageUrl: single });
        }
      } catch (e) {
        console.error('解析单张照片数据失败', e);
      }
    }

    // 处理排版照
    if (layoutData) {
      try {
        const layout = JSON.parse(decodeURIComponent(layoutData));
        // 如果是 base64，转换为临时文件
        if (layout.image_base64) {
          this.loadLayoutImage(layout.image_base64);
        }
      } catch (e) {
        console.error('解析排版照数据失败', e);
      }
    }

    // 初始化广告
    this.initAd();
  },

  /**
   * 加载单张照片
   */
  async loadSingleImage(base64Data) {
    try {
      const filePath = await storage.saveBase64Image(base64Data, 'single_photo.jpg');
      this.setData({ singleImageUrl: filePath });
    } catch (error) {
      console.error('加载单张照片失败', error);
    }
  },

  /**
   * 加载排版照
   */
  async loadLayoutImage(base64Data) {
    try {
      const filePath = await storage.saveBase64Image(base64Data, 'layout_photo.jpg');
      this.setData({ layoutImageUrl: filePath });
    } catch (error) {
      console.error('加载排版照失败', error);
    }
  },

  /**
   * 初始化广告
   */
  initAd() {
    if (!config.ad.enabled || !config.ad.rewardVideoAdUnitId) {
      console.log('广告未配置');
      return;
    }

    // 创建激励视频广告实例
    try {
      rewardVideoAd = wx.createRewardedVideoAd({
        adUnitId: config.ad.rewardVideoAdUnitId
      });

      // 监听广告关闭事件
      rewardVideoAd.onClose((status) => {
        if (status && status.isEnded) {
          // 用户完整观看了广告
          this.setData({ hasWatchedAd: true });
          wx.showToast({
            title: '已解锁保存功能',
            icon: 'success'
          });
        } else {
          // 用户未完整观看广告
          wx.showToast({
            title: '未完整观看广告',
            icon: 'none'
          });
        }
      });

      // 监听广告加载错误
      rewardVideoAd.onError((error) => {
        console.error('广告加载失败', error);
        // 广告加载失败，直接解锁（开发测试用）
        this.setData({ hasWatchedAd: true });
      });
    } catch (error) {
      console.error('创建广告实例失败', error);
    }
  },

  /**
   * 切换视图
   */
  switchView(e) {
    const view = e.currentTarget.dataset.view;
    this.setData({ currentView: view });
  },

  /**
   * 预览图片
   */
  previewImage(e) {
    const url = e.currentTarget.dataset.url;
    if (url) {
      wx.previewImage({
        urls: [url]
      });
    }
  },

  /**
   * 观看广告并保存
   */
  watchAdAndSave() {
    if (this.data.hasWatchedAd) {
      this.saveToAlbum();
      return;
    }

    if (!rewardVideoAd) {
      wx.showToast({
        title: '广告组件未初始化',
        icon: 'none'
      });
      return;
    }

    // 显示激励视频广告
    rewardVideoAd.show().catch(() => {
      // 广告显示失败，尝试加载
      rewardVideoAd.load().then(() => {
        return rewardVideoAd.show();
      }).catch((error) => {
        console.error('广告显示失败', error);
        wx.showToast({
          title: '广告加载失败',
          icon: 'none'
        });
      });
    });
  },

  /**
   * 保存到相册
   */
  async saveToAlbum() {
    if (!this.data.hasWatchedAd) {
      wx.showToast({
        title: '请先观看广告',
        icon: 'none'
      });
      return;
    }

    const currentUrl = this.data.currentView === 'single'
      ? this.data.singleImageUrl
      : this.data.layoutImageUrl;

    if (!currentUrl) {
      wx.showToast({
        title: '没有可保存的照片',
        icon: 'none'
      });
      return;
    }

    try {
      await storage.saveImageToPhotosAlbum(currentUrl);
      wx.showToast({
        title: '已保存到相册',
        icon: 'success'
      });

      // 保存到历史记录
      storage.saveToHistory({
        photoType: this.data.photoType,
        processedImages: {
          standard: this.data.singleImageUrl,
          layout: this.data.layoutImageUrl
        },
        backgroundColor: 'custom'
      });
    } catch (error) {
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      });
    }
  },

  /**
   * 返回编辑
   */
  backToEdit() {
    wx.navigateBack();
  },

  /**
   * 广告加载成功
   */
  adLoad() {
    console.log('广告加载成功');
  },

  /**
   * 广告加载失败
   */
  adError(e) {
    console.error('广告加载失败', e.detail);
  },

  /**
   * 广告关闭
   */
  adClose() {
    console.log('广告关闭');
  },

  onUnload() {
    // 销毁广告实例
    if (rewardVideoAd) {
      rewardVideoAd.destroy();
    }
  }
});
