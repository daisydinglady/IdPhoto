// pages/tools/change-bg/change-bg.js
Page({
  chooseImage() {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        wx.showToast({
          title: '功能开发中',
          icon: 'none'
        });
      }
    });
  }
});
