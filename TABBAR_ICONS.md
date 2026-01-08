# TabBar 图标配制说明

## ⚠️ 重要提示

小程序 tabBar 需要图标图片资源。请准备以下图标文件：

### 图标尺寸要求
- **尺寸**：81px × 81px（推荐）
- **格式**：PNG
- **大小**：不超过 40kb

### 需要的图标

#### 1. 首页 (Home)
- `assets/tabbar/home.png` - 未选中状态
- `assets/tabbar/home-active.png` - 选中状态（建议使用紫色 #667eea）

建议图标：🏠 房子图标

#### 2. 工具 (Tools)
- `assets/tabbar/tools.png` - 未选中状态
- `assets/tabbar/tools-active.png` - 选中状态

建议图标：🔧 扳手或工具箱图标

#### 3. 记录 (History)
- `assets/tabbar/history.png` - 未选中状态
- `assets/tabbar/history-active.png` - 选中状态

建议图标：🕐 时钟或历史记录图标

#### 4. 我的 (Profile)
- `assets/tabbar/profile.png` - 未选中状态
- `assets/tabbar/profile-active.png` - 选中状态

建议图标：👤 用户图标

## 📁 目录结构

创建目录和文件：
```
miniprogram/
└── assets/
    └── tabbar/
        ├── home.png
        ├── home-active.png
        ├── tools.png
        ├── tools-active.png
        ├── history.png
        ├── history-active.png
        ├── profile.png
        └── profile-active.png
```

## 🎨 图标准备方法

### 方法1：使用在线图标库
推荐网站：
- [iconfont.cn](https://www.iconfont.cn/)
- [Flaticon](https://www.flaticon.com/)
- [Iconfinder](https://www.iconfinder.com/)

### 方法2：使用微信官方图标
- 从微信小程序官方示例中获取
- 搜索"微信小程序 tabBar 图标"

### 方法3：自定义设计
- 使用 Figma、Sketch 等设计工具
- 导出 81px × 81px 的 PNG 图片

## ⚙️ 临时解决方案

如果暂时没有图标，可以：

### 选项1：注释掉 tabBar（推荐）
编辑 `app.json`，删除 `tabBar` 配置块，保留页面路径。

### 选项2：使用纯色图标
可以使用在线工具生成纯色占位图标：
- [IconKitchen](https://icon.kitchen/)
- [MakeAppIcon](https://makeappicon.com/)

## 📋 完成配置后的检查清单

- [ ] 创建 assets/tabbar 目录
- [ ] 放置8个图标文件
- [ ] 检查文件名是否正确
- [ ] 重新编译小程序
- [ ] 确认 tabBar 正常显示

## 🎯 下一步

准备好图标后，将图标文件放到 `miniprogram/assets/tabbar/` 目录下，重新编译小程序即可。

---

**提示**：为了确保小程序能正常编译，如果暂时没有图标，可以先注释掉 `app.json` 中的 `tabBar` 配置，等准备好图标后再取消注释。
