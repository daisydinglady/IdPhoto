// data/photo-sizes.js
module.exports = {
  // 常用证件照
  common: [
    {
      id: 'c1',
      name: '一寸',
      width: 295,
      height: 413,
      dpi: 300,
      desc: '25mm × 35mm',
      category: 'common',
      usage: ['简历', '工牌', '学生证']
    },
    {
      id: 'c2',
      name: '二寸',
      width: 413,
      height: 626,
      dpi: 300,
      desc: '35mm × 53mm',
      category: 'common',
      usage: ['简历', '证件照']
    },
    {
      id: 'c3',
      name: '小二寸',
      width: 390,
      height: 567,
      dpi: 300,
      desc: '33mm × 48mm',
      category: 'common',
      usage: ['护照', '签证']
    },
    {
      id: 'c4',
      name: '五寸',
      width: 1772,
      height: 1181,
      dpi: 300,
      desc: '127mm × 89mm',
      category: 'common',
      usage: ['生活照', '普通照片']
    }
  ],

  // 考试/报名证件照
  exam: [
    {
      id: 'e1',
      name: '四六级',
      width: 295,
      height: 413,
      dpi: 300,
      desc: '一寸照',
      category: 'exam',
      usage: ['大学英语四六级', '英语专业四八级']
    },
    {
      id: 'e2',
      name: '考研',
      width: 295,
      height: 413,
      dpi: 300,
      desc: '一寸照',
      category: 'exam',
      usage: ['研究生入学考试', '博士入学考试']
    },
    {
      id: 'e3',
      name: '公务员',
      width: 413,
      height: 626,
      dpi: 300,
      desc: '二寸照',
      category: 'exam',
      usage: ['国考', '省考', '事业单位']
    },
    {
      id: 'e4',
      name: '教师资格证',
      width: 295,
      height: 413,
      dpi: 300,
      desc: '一寸照',
      category: 'exam',
      usage: ['教师资格证', '教师招聘']
    },
    {
      id: 'e5',
      name: '会计证',
      width: 295,
      height: 413,
      dpi: 300,
      desc: '一寸照',
      category: 'exam',
      usage: ['初级会计', '中级会计', 'CPA']
    },
    {
      id: 'e6',
      name: '计算机等级考试',
      width: 295,
      height: 413,
      dpi: 300,
      desc: '一寸照',
      category: 'exam',
      usage: ['NCRE', '计算机技术与软件专业技术资格']
    }
  ],

  // 签证/护照证件照
  visa: [
    {
      id: 'v1',
      name: '美国签证',
      width: 413,
      height: 531,
      dpi: 300,
      desc: '51mm × 51mm',
      category: 'visa',
      usage: ['美国签证', '美国绿卡']
    },
    {
      id: 'v2',
      name: '日本签证',
      width: 413,
      height: 531,
      dpi: 300,
      desc: '45mm × 45mm',
      category: 'visa',
      usage: ['日本签证', '日本入境']
    },
    {
      id: 'v3',
      name: '韩国签证',
      width: 413,
      height: 531,
      dpi: 300,
      desc: '35mm × 45mm',
      category: 'visa',
      usage: ['韩国签证', '韩国入境']
    },
    {
      id: 'v4',
      name: '申根签证',
      width: 413,
      height: 531,
      dpi: 300,
      desc: '35mm × 45mm',
      category: 'visa',
      usage: ['申根签证', '欧洲国家']
    },
    {
      id: 'v5',
      name: '中国护照',
      width: 413,
      height: 626,
      dpi: 300,
      desc: '33mm × 48mm',
      category: 'visa',
      usage: ['中国护照', '港澳通行证', '台湾通行证']
    },
    {
      id: 'v6',
      name: '港澳通行证',
      width: 413,
      height: 531,
      dpi: 300,
      desc: '33mm × 48mm',
      category: 'visa',
      usage: ['港澳通行证', '香港签证', '澳门签证']
    }
  ]
};
