// pages/profile/profile.js
Page({
  data: {},

  /**
   * 跳转到常见问题
   */
  goToFAQ() {
    wx.navigateTo({
      url: '/pages/profile/faq/faq'
    });
  },

  /**
   * 跳转到拍摄攻略
   */
  goToGuide() {
    wx.navigateTo({
      url: '/pages/profile/guide/guide'
    });
  },

  /**
   * 跳转到关于我们
   */
  goToAbout() {
    wx.navigateTo({
      url: '/pages/profile/about/about'
    });
  },

  /**
   * 跳转到联系我们
   */
  goToContact() {
    wx.navigateTo({
      url: '/pages/profile/contact/contact'
    });
  }
});
