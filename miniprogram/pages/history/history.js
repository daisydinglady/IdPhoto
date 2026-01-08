// pages/history/history.js
const storage = require('../../utils/storage.js');

Page({
  data: {
    historyList: []
  },

  onLoad() {
    this.loadHistory();
  },

  onShow() {
    // 页面显示时重新加载历史记录
    this.loadHistory();
  },

  /**
   * 加载历史记录
   */
  loadHistory() {
    const history = storage.getHistory();

    // 格式化时间
    const historyList = history.map(item => {
      const date = new Date(item.timestamp);
      const now = new Date();
      const diff = now - date;

      let timeText = '';
      if (diff < 60000) {
        timeText = '刚刚';
      } else if (diff < 3600000) {
        timeText = `${Math.floor(diff / 60000)} 分钟前`;
      } else if (diff < 86400000) {
        timeText = `${Math.floor(diff / 3600000)} 小时前`;
      } else if (diff < 2592000000) {
        timeText = `${Math.floor(diff / 86400000)} 天前`;
      } else {
        timeText = `${date.getMonth() + 1}月${date.getDate()}日`;
      }

      return {
        ...item,
        timeText
      };
    });

    this.setData({ historyList });
  },

  /**
   * 查看历史记录
   */
  viewHistory(e) {
    const item = e.currentTarget.dataset.item;

    // 跳转到预览页面
    wx.navigateTo({
      url: `/pages/preview/preview?singlePath=${encodeURIComponent(item.processedImages.standard)}&name=${item.photoType.name}&fromHistory=true`
    });
  },

  /**
   * 删除单条历史记录
   */
  deleteHistory(e) {
    const id = e.currentTarget.dataset.id;

    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条历史记录吗？',
      success: (res) => {
        if (res.confirm) {
          storage.deleteHistoryItem(id);
          this.loadHistory();
          wx.showToast({
            title: '已删除',
            icon: 'success'
          });
        }
      }
    });
  },

  /**
   * 清空所有历史
   */
  clearAll() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有历史记录吗？',
      success: (res) => {
        if (res.confirm) {
          storage.clearHistory();
          this.setData({ historyList: [] });
          wx.showToast({
            title: '已清空',
            icon: 'success'
          });
        }
      }
    });
  },

  /**
   * 跳转到首页
   */
  goToIndex() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
});
