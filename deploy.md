# 宝塔面板部署指南

## 📋 **部署准备清单**

### 1. **服务器要求**
- ✅ Linux服务器（CentOS/Ubuntu）
- ✅ 已安装宝塔面板 7.0+
- ✅ Nginx 1.18+
- ✅ 域名并解析到服务器IP

### 2. **文件准备**
- ✅ `dist/` 文件夹（已构建完成）
- ✅ `nginx.conf` 配置文件
- ✅ 域名SSL证书（可选）

## 🚀 **详细部署步骤**

### 步骤1: 在宝塔面板创建网站

1. **登录宝塔面板**
   ```
   http://你的服务器IP:8888
   ```

2. **添加站点**
   - 点击 "网站" → "添加站点"
   - 域名: `your-domain.com`
   - 根目录: `/www/wwwroot/your-domain.com`
   - PHP版本: 选择 "静态"
   - 数据库: 不创建

### 步骤2: 上传文件

1. **上传dist文件**
   - 在文件管理中进入: `/www/wwwroot/your-domain.com`
   - 删除默认的 `index.html`
   - 上传整个 `dist` 文件夹的内容到根目录

2. **文件结构应该是:**
   ```
   /www/wwwroot/your-domain.com/
   ├── index.html
   ├── assets/
   │   ├── index-xxx.css
   │   └── index-xxx.js
   ├── robots.txt
   ├── sitemap.xml
   └── vite.svg
   ```

### 步骤3: 配置Nginx

1. **修改站点配置**
   - 在 "网站" 列表中点击站点的 "设置"
   - 选择 "配置文件"
   - 替换为提供的 `nginx.conf` 内容
   - 修改域名为你的实际域名

2. **重要配置项:**
   ```nginx
   # 替换这行
   server_name your-domain.com www.your-domain.com;
   # 改为你的域名
   server_name yourdomain.com www.yourdomain.com;
   ```

### 步骤4: 配置SSL证书（推荐）

1. **申请SSL证书**
   - 在站点设置中选择 "SSL"
   - 选择 "Let's Encrypt" 免费证书
   - 或者上传自己的证书

2. **强制HTTPS**
   - 开启 "强制HTTPS"
   - 启用 "HSTS"

### 步骤5: 性能优化

1. **开启缓存**
   - 文件管理 → 站点目录
   - 创建 `.htaccess` 文件（如果使用Apache）

2. **开启CDN（可选）**
   - 使用阿里云CDN或腾讯云CDN
   - 配置静态资源加速

## 🔧 **环境变量配置**

如果你的应用需要环境变量，需要在构建时配置：

### 本地构建时配置：

1. **创建 `.env.production` 文件:**
   ```env
   VITE_SUPABASE_URL=https://wfskcnydzduvy​inmxmzy.supabase.co
   VITE_SUPABASE_ANON_KEY=你的supabase密钥
   VITE_APP_URL=https://yourdomain.com
   ```

2. **重新构建:**
   ```bash
   npm run build
   ```

3. **重新上传dist文件**

## 📊 **性能监控**

### 1. **网站速度测试**
- GTmetrix: https://gtmetrix.com/
- PageSpeed Insights: https://pagespeed.web.dev/

### 2. **预期性能指标**
- **首屏加载时间**: < 3秒
- **LCP (最大内容绘制)**: < 2.5秒
- **FID (首次输入延迟)**: < 100ms
- **CLS (累积布局偏移)**: < 0.1

## 🛠️ **常见问题解决**

### 问题1: 刷新页面404错误
**解决:** 确保Nginx配置中有这行：
```nginx
try_files $uri $uri/ /index.html;
```

### 问题2: 静态资源加载失败
**解决:** 检查文件权限：
```bash
chmod -R 755 /www/wwwroot/your-domain.com
```

### 问题3: CORS跨域问题
**解决:** 在Nginx配置中添加：
```nginx
add_header Access-Control-Allow-Origin "*";
```

### 问题4: 大文件上传限制
**解决:** 在宝塔面板设置中修改：
- PHP设置 → 上传限制
- Nginx设置 → 请求体大小

## 🔄 **自动化部署（进阶）**

### 使用Git钩子自动部署：

1. **在服务器上安装Git**
2. **创建部署脚本**
3. **设置Webhook**

```bash
#!/bin/bash
cd /path/to/your/project
git pull origin main
npm install
npm run build
cp -r dist/* /www/wwwroot/your-domain.com/
```

## 📈 **SEO优化检查**

部署完成后检查：

- ✅ robots.txt 可访问
- ✅ sitemap.xml 可访问  
- ✅ HTTPS 正常工作
- ✅ 页面标题和描述正确
- ✅ Open Graph 标签工作
- ✅ 网站速度合格

## 📞 **技术支持**

如果遇到问题：
1. 检查宝塔面板错误日志
2. 查看Nginx错误日志
3. 使用浏览器开发者工具调试 