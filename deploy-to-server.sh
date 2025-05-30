#!/bin/bash

# NFT Maker Tool - 自动化部署脚本
# 用于部署到宝塔面板服务器

echo "🚀 开始自动化部署到服务器..."

# 配置信息 - 请修改为你的服务器信息
SERVER_HOST="144.34.238.26"
SERVER_USER="root"
SERVER_PATH="/www/wwwroot/nftmaker.site"  # 宝塔面板默认网站路径
SERVER_PORT="22"

# 检查是否设置了服务器信息
if [ "$SERVER_HOST" = "你的服务器IP" ]; then
    echo "❌ 请先编辑脚本，设置你的服务器信息："
    echo "   - SERVER_HOST: 你的服务器IP地址"
    echo "   - SERVER_USER: SSH用户名（通常是root）"
    echo "   - SERVER_PATH: 网站文件路径（通常是 /www/wwwroot/域名）"
    echo "   - SERVER_PORT: SSH端口（通常是22）"
    exit 1
fi

# 步骤1: 构建项目
echo "📦 正在构建项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败！请检查代码错误"
    exit 1
fi

echo "✅ 构建完成！"

# 步骤2: 创建部署压缩包
echo "📦 正在打包文件..."
cd dist
tar -czf ../deploy.tar.gz *
cd ..

# 步骤3: 上传到服务器
echo "🌐 正在上传到服务器..."
scp -P $SERVER_PORT deploy.tar.gz $SERVER_USER@$SERVER_HOST:/tmp/

# 步骤4: 在服务器上解压和部署
echo "🔄 正在服务器上部署..."
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST << 'EOF'
    # 备份当前网站（可选）
    if [ -d "/www/wwwroot/nftmaker.site" ]; then
        echo "📁 备份当前网站..."
        cp -r /www/wwwroot/nftmaker.site /www/backup/nftmaker_backup_$(date +%Y%m%d_%H%M%S)
    fi
    
    # 清空网站目录并解压新文件
    echo "🗂  清空网站目录..."
    rm -rf /www/wwwroot/nftmaker.site/*
    
    echo "📂 解压新文件..."
    cd /www/wwwroot/nftmaker.site
    tar -xzf /tmp/deploy.tar.gz
    
    # 设置正确的权限
    echo "🔐 设置文件权限..."
    chown -R www:www /www/wwwroot/nftmaker.site
    chmod -R 755 /www/wwwroot/nftmaker.site
    
    # 清理临时文件
    rm -f /tmp/deploy.tar.gz
    
    echo "✅ 服务器部署完成！"
EOF

# 清理本地临时文件
rm -f deploy.tar.gz

# 提交到Git（可选）
echo "📝 提交更改到Git..."
git add .
git commit -m "deploy: 部署到服务器 $(date '+%Y-%m-%d %H:%M:%S')"
git push origin main

echo ""
echo "🎉 部署完成！"
echo "🌐 网站地址: https://nftmaker.site"
echo "📊 可以查看Google Analytics数据了"
echo ""
echo "💡 下次部署只需要运行: ./deploy-to-server.sh" 