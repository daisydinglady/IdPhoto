// pages/index/index.js
const photoSizes = require('../../data/photo-sizes.js');

Page({
  data: {
    currentTab: 'common',
    currentList: [],
    allData: photoSizes
  },

  onLoad() {
    // 默认显示常用尺寸
    this.setData({
      currentList: this.data.allData.common
    });
  },

  /**
   * 切换分类标签
   */
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    let list = [];

    switch(tab) {
      case 'common':
        list = this.data.allData.common;
        break;
      case 'exam':
        list = this.data.allData.exam;
        break;
      case 'visa':
        list = this.data.allData.visa;
        break;
    }

    this.setData({
      currentTab: tab,
      currentList: list
    });
  },

  /**
   * 选择证件照尺寸
   */
  selectSize(e) {
    const size = e.currentTarget.dataset.size;

    // 跳转到上传页面，传递参数
    wx.navigateTo({
      url: `/pages/upload/upload?sizeId=${size.id}&name=${size.name}&width=${size.width}&height=${size.height}`
    });
  }
});
