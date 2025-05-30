# 🚀 自动化部署指南

## 方案1: Vercel自动部署（推荐）

### 步骤1: 安装Vercel CLI
```bash
npm i -g vercel
```

### 步骤2: 登录Vercel
```bash
vercel login
```

### 步骤3: 初始化项目
在项目根目录执行：
```bash
vercel
```
按照提示操作：
- 选择你的账户
- 链接到现有项目或创建新项目
- 设置项目名称（建议：nft-maker-tool）

### 步骤4: 绑定自定义域名
在Vercel控制台中：
1. 进入项目设置 → Domains
2. 添加 `nftmaker.site`
3. 按照提示配置DNS记录

### 步骤5: 设置自动部署
- ✅ 每次推送到main分支会自动部署
- ✅ 每次Pull Request会创建预览部署
- ✅ 构建失败会自动回滚

## 方案2: GitHub Actions + GitHub Pages

### 创建GitHub Actions工作流：

`.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## 方案3: 快速部署命令

创建快速部署脚本：

### deploy.sh:
```bash
#!/bin/bash
echo "🚀 开始自动部署..."

# 构建项目
npm run build

# 提交到Git
git add .
git commit -m "chore: auto deploy $(date '+%Y-%m-%d %H:%M:%S')"
git push origin main

echo "✅ 部署完成！"
```

使用方法：
```bash
chmod +x deploy.sh
./deploy.sh
```

## 🎯 推荐方案对比

| 方案 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| **Vercel** | 最简单、CDN加速、自定义域名 | 需要第三方服务 | ⭐ **推荐** |
| GitHub Pages | 免费、GitHub集成 | 功能有限 | 个人项目 |
| 手动脚本 | 完全控制 | 需要手动执行 | 临时方案 |

## 🛠 配置环境变量

在Vercel中设置环境变量：
1. 进入项目设置 → Environment Variables
2. 添加以下变量：
   ```
   VITE_SUPABASE_URL=你的Supabase URL
   VITE_SUPABASE_ANON_KEY=你的Supabase Key
   ```

## 📊 部署监控

部署后可以监控：
- ✅ 构建状态
- ✅ 部署日志  
- ✅ 性能指标
- ✅ 错误追踪

## 🔄 工作流程

1. **开发** → 本地修改代码
2. **提交** → `git push origin main`
3. **自动构建** → Vercel自动检测并构建
4. **部署** → 自动部署到生产环境
5. **通知** → 部署成功/失败通知

---

**一次设置，永久自动！再也不用手动上传文件了 🎉** 