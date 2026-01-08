// pages/tools/tools.js
Page({
  data: {},

  /**
   * 更换背景色
   */
  changeBackground() {
    wx.navigateTo({
      url: '/pages/tools/change-bg/change-bg'
    });
  },

  /**
   * 生成排版照
   */
  generateLayout() {
    wx.navigateTo({
      url: '/pages/tools/layout/layout'
    });
  },

  /**
   * 人像抠图
   */
  humanMatting() {
    wx.navigateTo({
      url: '/pages/tools/matting/matting'
    });
  },

  /**
   * 调整KB大小
   */
  resizeKB() {
    wx.navigateTo({
      url: '/pages/tools/resize-kb/resize-kb'
    });
  },

  /**
   * 照片裁剪
   */
  cropPhoto() {
    wx.navigateTo({
      url: '/pages/tools/crop/crop'
    });
  },

  /**
   * 添加水印
   */
  addWatermark() {
    wx.navigateTo({
      url: '/pages/tools/watermark/watermark'
    });
  }
});
