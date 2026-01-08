// pages/profile/contact/contact.js
Page({
  data: {},

  /**
   * 复制文本
   */
  copyText(e) {
    const text = e.currentTarget.dataset.text;
    wx.setClipboardData({
      data: text,
      success: () => {
        wx.showToast({
          title: '已复制',
          icon: 'success'
        });
      }
    });
  },

  /**
   * 打开微信
   */
  openWechat() {
    wx.showToast({
      title: '微信号已复制',
      icon: 'success'
    });
  }
});