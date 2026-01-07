# 调试指南

## 已修复的问题

### 1. Base64 解码错误 ✅
**问题**：点击"生成排版照"时报错 `Failed to execute 'atob'`

**原因**：
- HivisionIDPhotos 返回的 base64 数据格式可能不标准
- 传递给预览页面的数据类型不正确

**已修复**：
- ✅ 改进了 `storage.js` 中的 `saveBase64Image` 函数
- ✅ 添加了 base64 数据验证和错误处理
- ✅ 修复了编辑页面传递数据的逻辑
- ✅ 预览页面现在正确处理文件路径

---

## 如何调试

### 1. 查看控制台日志

**微信开发者工具**：
1. 打开"调试器"标签
2. 查看 Console 面板
3. 点击"生成排版照"时观察日志输出

**关键日志**：
```
添加背景色，颜色： #4A90E2
临时文件创建成功： wx://...
API 返回结果： {success: true, data: {...}}
新图片创建成功： wx://...
```

### 2. 检查网络请求

1. 打开"调试器" → "Network" 标签
2. 点击"生成排版照"
3. 查找 `/api/idphoto/layout` 请求
4. 检查：
   - Request URL
   - Request Method (应该是 POST)
   - Request Payload (应该包含图片文件)
   - Response Status (应该是 200)
   - Response Data (应该包含 `image_base64` 字段)

### 3. 验证 HivisionIDPhotos 服务

**检查服务是否运行**：
```bash
curl http://127.0.0.1:8080
```

**测试生成排版照接口**：
```bash
curl -X POST http://127.0.0.1:8080/generate_layout_photos \
  -F "input_image=@test.jpg" \
  -F "height=413" \
  -F "width=295"
```

### 4. 检查后端日志

查看 Node.js 后端输出，确认：
- ✅ 请求成功转发到 HivisionIDPhotos
- ✅ 收到正确的响应
- ✅ 返回的数据包含 `image_base64`

---

## 常见错误排查

### 错误 1: "原始证件照数据不存在"
**原因**：从上传页面传递过来的数据不完整

**解决**：
1. 检查上传页面的 `generateIdphoto` 方法
2. 确认后端返回的数据包含 `image_base64_standard`
3. 查看 Console 中的完整错误堆栈

### 错误 2: "Invalid base64 format"
**原因**：base64 字符串格式不正确

**解决**：
1. 检查后端返回的原始数据
2. 确认 `image_base64` 字段存在且不为空
3. 可能需要在后端添加数据验证

### 错误 3: "写入文件失败"
**原因**：文件系统操作失败

**解决**：
1. 检查是否有足够存储空间
2. 确认文件名合法
3. 查看 Console 中的详细错误信息

### 错误 4: "网络错误"
**原因**：后端服务未启动或地址配置错误

**解决**：
1. 确认 Node.js 后端正在运行 (`npm run dev`)
2. 检查 `miniprogram/utils/config.js` 中的 `apiBaseURL`
3. 确认后端端口（默认 3000）未被占用

---

## 数据流追踪

### 完整流程：

1. **上传照片** (`pages/upload/upload.js`)
   ```
   选择图片 → 调用 api.generateIdphoto() → 后端转发到 HivisionIDPhotos
   ```

2. **生成透明底证件照** (`server/src/services/hivisionService.js`)
   ```
   调用 /idphoto 接口 → 返回 image_base64_standard 和 image_base64_hd
   ```

3. **跳转到编辑页** (`pages/edit/edit.js`)
   ```
   接收 base64 数据 → 保存到 this.data.originalData
   ```

4. **添加背景色** (`pages/edit/edit.js`)
   ```
   base64 → 临时文件 → 调用 api.changeBackground() → 返回新的 base64
   ```

5. **生成排版照** (`pages/edit/edit.js`)
   ```
   当前图片文件 → 调用 api.generateLayout() → 返回排版照 base64
   ```

6. **跳转到预览页** (`pages/preview/preview.js`)
   ```
   接收排版照 base64 → 转换为临时文件 → 显示
   ```

---

## 测试检查清单

- [ ] HivisionIDPhotos 服务正在运行
- [ ] Node.js 后端正在运行
- [ ] 小程序配置文件中的 `apiBaseURL` 正确
- [ ] 可以成功上传照片
- [ ] 可以生成透明底证件照
- [ ] 可以切换背景色
- [ ] 可以生成排版照
- [ ] 可以预览和保存图片

---

## 需要更多帮助？

如果问题仍然存在，请提供：
1. 完整的错误堆栈信息
2. Console 中的日志输出
3. Network 标签中的请求/响应数据
4. 后端服务器的日志输出

---

## 快速测试

使用以下代码在 Console 中测试 base64 转换：

```javascript
// 测试 base64 解码
const testBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
try {
  const buffer = wx.base64ToArrayBuffer(testBase64);
  console.log('base64 解码成功', buffer);
} catch (e) {
  console.error('base64 解码失败', e);
}
```

如果测试成功，说明 base64 功能正常，问题可能在数据传递环节。
