# 证件照小程序 - 快速启动指南

## 项目已创建完成！

以下是你需要完成的步骤来启动项目：

---

## 第一步：启动 HivisionIDPhotos 服务

确保你的 HivisionIDPhotos Docker 服务已经运行。如果没有运行，请执行：

```bash
# 使用 Docker 启动服务（根据你的实际命令）
docker run -p 8080:8080 ...
```

检查服务是否正常运行：
```bash
curl http://localhost:8080
```

---

## 第二步：配置并启动 Node.js 后端

### 1. 进入后端目录
```bash
cd server
```

### 2. 安装依赖
```bash
npm install
```

### 3. 创建环境配置文件
```bash
cp .env.example .env
```

### 4. 编辑 `.env` 文件
根据需要修改配置，主要配置项：
```env
# 后端服务端口
PORT=3000

# HivisionIDPhotos 服务地址
HIVISION_API_URL=http://localhost:8080
```

### 5. 启动后端服务
```bash
# 开发模式（自动重启）
npm run dev

# 或生产模式
npm start
```

后端服务将运行在 `http://localhost:3000`

---

## 第三步：配置并启动微信小程序

### 1. 打开微信开发者工具
- 下载并安装微信开发者工具
- 使用微信扫码登录

### 2. 导入项目
- 点击"导入项目"
- 选择 `IdPhoto-weapp/miniprogram` 目录
- 填写项目名称和 AppID（测试可选择"测试号"）
- 点击"导入"

### 3. 修改后端地址配置

编辑 `miniprogram/utils/config.js` 文件，确认后端地址正确：

```javascript
const config = {
  // 确保这个地址与你的后端服务一致
  apiBaseURL: 'http://localhost:3000',
  // ...
};
```

### 4. 编译运行
- 微信开发者工具会自动编译
- 点击"编译"按钮查看效果

---

## 第四步：测试功能

### 测试流程
1. **首页** → 选择证件照类型（如"一寸"）
2. **上传页** → 上传或拍摄一张照片
3. **编辑页** → 选择背景色，点击"生成排版照"
4. **预览页** → 预览效果，点击"保存到相册"（开发模式下可直接保存）

### 后端测试
使用以下命令测试后端 API：

```bash
# 健康检查
curl http://localhost:3000/health

# 获取证件照尺寸列表
curl http://localhost:3000/api/idphoto/sizes
```

---

## 项目结构

```
IdPhoto-weapp/
├── miniprogram/          # 微信小程序前端
│   ├── pages/           # 页面
│   ├── components/      # 组件
│   ├── utils/           # 工具函数
│   ├── data/            # 数据文件
│   └── app.js/json/wxss # 小程序配置
├── server/              # Node.js 后端
│   ├── src/            # 源代码
│   │   ├── config/     # 配置
│   │   ├── controllers/# 控制器
│   │   ├── services/   # 服务
│   │   ├── routes/     # 路由
│   │   └── middleware/ # 中间件
│   ├── package.json
│   └── server.js
└── README.md
```

---

## 常见问题

### 1. 后端启动失败
- 检查端口 3000 是否被占用
- 确认已执行 `npm install`
- 查看 Node.js 版本（需要 >= 16.x）

### 2. 小程序无法连接后端
- 确认后端服务正在运行
- 检查 `miniprogram/utils/config.js` 中的 `apiBaseURL` 是否正确
- 开发工具中点击"详情" → "本地设置" → 勾选"不校验合法域名"

### 3. 上传图片失败
- 检查 HivisionIDPhotos 服务是否正常运行
- 确认图片格式为 JPG 或 PNG
- 确认图片大小小于 10MB

### 4. 生成证件照失败
- 查看 HivisionIDPhotos 服务日志
- 确认照片中包含人脸
- 尝试使用光线充足、正面清晰的照片

---

## 下一步开发建议

### 功能完善
1. **添加更多证件照尺寸**：编辑 `miniprogram/data/photo-sizes.js`
2. **集成激励视频广告**：申请微信流量主，配置广告位
3. **添加历史记录页面**：查看和删除历史证件照
4. **添加参数调整功能**：亮度、对比度、头部位置等

### 部署上线
1. **后端部署**：
   - 购买云服务器（阿里云/腾讯云）
   - 配置域名和 SSL 证书
   - 部署 Node.js 服务
   - 部署 HivisionIDPhotos 服务

2. **小程序上线**：
   - 注册小程序（个人或企业）
   - 配置服务器域名（request、uploadFile）
   - 提交审核

---

## 技术支持

如有问题，请查看：
- 项目 README.md
- HivisionIDPhotos 官方文档
- 微信小程序开发文档

祝你开发顺利！🎉
