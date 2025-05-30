# Google Analytics 设置指南

## 📊 Google Analytics 4 (GA4) 配置

### 1. 获取你的GA4测量ID

1. 访问 [Google Analytics](https://analytics.google.com/)
2. 创建新的GA4属性（如果还没有的话）
3. 在"数据流"中添加你的网站
4. 复制测量ID（格式：G-XXXXXXXXXX）

### 2. 替换配置

在 `index.html` 文件中，将 `GA_MEASUREMENT_ID` 替换为你的真实测量ID：

```html
<!-- 替换这两处 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=你的测量ID"></script>
<script>
  gtag('config', '你的测量ID', {
    // 配置选项...
  });
</script>
```

### 3. 自定义事件使用

我们已经预设了NFT相关的事件跟踪：

```javascript
// NFT相关事件
window.trackNFTEvent('generate', 'NFT_Creation', 'Batch_Generate', 100);
window.trackNFTEvent('upload', 'IPFS', 'Image_Upload', 1);
window.trackNFTEvent('deploy', 'Smart_Contract', 'Contract_Deploy');

// 用户行为事件
window.trackUserAction('register', {
  label: 'User_Registration',
  userType: 'new_user',
  feature: 'auth_system'
});

window.trackUserAction('project_create', {
  label: 'Project_Creation',
  userType: 'authenticated',
  feature: 'project_editor'
});
```

### 4. 关键性能指标 (KPIs)

建议跟踪的指标：

- **用户参与度**：页面浏览量、会话时长、跳出率
- **转化指标**：注册率、项目创建率、NFT生成成功率
- **功能使用**：各功能模块的使用频率
- **错误监控**：生成失败、上传失败等错误事件

### 5. 环境变量配置（可选）

如果你想使用环境变量管理GA ID：

1. 在 `.env.local` 中添加：
   ```
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

2. 在代码中使用：
   ```javascript
   gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID);
   ```

### 6. 数据隐私合规

- 已配置基本的数据收集
- 建议添加Cookie同意横幅
- 确保符合GDPR、CCPA等隐私法规

### 7. 测试验证

1. 部署后访问网站
2. 在GA4实时报告中查看数据
3. 使用浏览器开发者工具检查网络请求
4. 确认事件正确发送到GA4

## 🎯 重要提醒

- **立即替换** `GA_MEASUREMENT_ID` 为你的真实ID
- 测试所有自定义事件是否正常工作
- 设置转化目标以跟踪重要业务指标
- 定期检查数据质量和准确性 