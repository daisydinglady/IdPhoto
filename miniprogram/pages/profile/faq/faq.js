// pages/profile/faq/faq.js
Page({
  data: {
    faqList: [
      {
        id: 1,
        question: '如何制作证件照？',
        answer: '1. 在首页选择需要的证件照类型\n2. 点击上传或拍摄照片\n3. 等待AI自动处理\n4. 选择背景色\n5. 生成排版照\n6. 保存到相册',
        expanded: false
      },
      {
        id: 2,
        question: '支持哪些证件照尺寸？',
        answer: '我们支持常用的证件照尺寸，包括：\n• 一寸、二寸、小二寸\n• 四六级、考研、公务员考试\n• 美国签证、日本签证等\n\n如需其他尺寸，可通过"实用工具"中的自定义功能制作。',
        expanded: false
      },
      {
        id: 3,
        question: '照片有什么要求？',
        answer: '• 请使用近期正面照片\n• 光线充足，背景干净\n• 五官清晰，表情自然\n• 不戴帽子、墨镜等饰品\n• 支持JPG、PNG格式，大小不超过10MB',
        expanded: false
      },
      {
        id: 4,
        question: '制作需要多长时间？',
        answer: '通常情况下，AI处理需要3-10秒，具体时间取决于照片大小和服务器负载。',
        expanded: false
      },
      {
        id: 5,
        question: '如何保存证件照？',
        answer: '生成证件照后，点击"保存到相册"按钮即可。首次使用需要授权相册访问权限。',
        expanded: false
      },
      {
        id: 6,
        question: '可以调整照片大小吗？',
        answer: '可以！在"实用工具"中提供"调整KB大小"功能，可以将照片压缩到指定大小。',
        expanded: false
      },
      {
        id: 7,
        question: '制作的证件照可以直接使用吗？',
        answer: '完全可以！我们的AI处理系统会自动进行人脸检测、抠图、裁切和美化，生成的证件照符合标准规格，可直接用于各类证件办理。',
        expanded: false
      },
      {
        id: 8,
        question: '是否收费？',
        answer: '基础功能完全免费使用！部分高级功能可能需要观看广告后才能使用。',
        expanded: false
      }
    ]
  },

  /**
   * 切换答案显示
   */
  toggleAnswer(e) {
    const index = e.currentTarget.dataset.index;
    const list = this.data.faqList;
    list[index].expanded = !list[index].expanded;
    this.setData({ faqList: list });
  }
});
