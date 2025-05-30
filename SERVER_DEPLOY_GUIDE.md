# 🚀 服务器自动化部署指南

## 配置步骤

### 1. 编辑部署脚本
打开 `deploy-to-server.sh` 文件，修改以下配置：

```bash
SERVER_HOST="你的服务器IP"        # 改为你的实际服务器IP
SERVER_USER="root"               # SSH用户名，通常是root
SERVER_PATH="/www/wwwroot/nftmaker.site"  # 宝塔面板网站路径
SERVER_PORT="22"                 # SSH端口，默认22
```

### 2. 确保SSH密钥配置
为了避免每次输入密码，建议配置SSH密钥：

```bash
# 生成SSH密钥（如果还没有）
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# 复制公钥到服务器
ssh-copy-id -p 22 root@你的服务器IP
```

### 3. 宝塔面板设置
确保在宝塔面板中：
- ✅ 已创建网站 `nftmaker.site`
- ✅ 网站目录指向 `/www/wwwroot/nftmaker.site`
- ✅ 已配置SSL证书
- ✅ 防火墙开放22端口（SSH）

### 4. 一键部署
配置完成后，每次部署只需要运行：

```bash
./deploy-to-server.sh
```

## 部署流程

脚本会自动：
1. 📦 构建项目 (`npm run build`)
2. 🗜️ 打包dist文件夹
3. 🌐 上传到服务器
4. 🔄 在服务器上解压
5. 🔐 设置正确权限
6. 📝 提交到Git
7. 🎉 部署完成

## 目录结构

宝塔面板默认网站结构：
```
/www/wwwroot/nftmaker.site/
├── index.html
├── assets/
│   ├── index-xxx.css
│   └── index-xxx.js
└── 其他静态文件
```

## 故障排除

### 权限问题
如果遇到权限问题：
```bash
# 在服务器上执行
chown -R www:www /www/wwwroot/nftmaker.site
chmod -R 755 /www/wwwroot/nftmaker.site
```

### SSH连接问题
1. 检查服务器IP是否正确
2. 检查SSH端口是否开放
3. 检查防火墙设置

### 宝塔面板Nginx配置
确保Nginx配置正确：
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

## 自动化选项

如果想要更自动化，可以设置：

### GitHub Actions自动部署
每次推送代码自动部署到服务器

### Webhook部署
设置webhook，push到GitHub时自动触发服务器拉取更新

需要这些功能请告诉我！

---

**现在你只需要一个命令就能部署了！再也不用手动上传文件 🎉** 