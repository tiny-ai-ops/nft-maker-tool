#!/bin/bash

echo "🔍 NFT Maker 网站健康检查报告"
echo "================================="
echo "检查时间: $(date)"
echo "目标网站: nftmaker.site"
echo ""

# 检查域名解析
echo "📍 1. 域名解析检查"
echo "--------------------------------"
nslookup nftmaker.site
echo ""

# 检查HTTP状态
echo "🌐 2. HTTP连接检查"
echo "--------------------------------"
echo "HTTP状态码:"
curl -I -s -o /dev/null -w "%{http_code}" http://nftmaker.site
echo ""
echo "HTTPS状态码:"
curl -I -s -o /dev/null -w "%{http_code}" https://nftmaker.site
echo ""

# 检查SSL证书
echo "🔒 3. SSL证书检查"
echo "--------------------------------"
echo | openssl s_client -servername nftmaker.site -connect nftmaker.site:443 2>/dev/null | openssl x509 -noout -dates
echo ""

# 检查响应时间
echo "⚡ 4. 响应时间检查"
echo "--------------------------------"
echo "响应时间:"
curl -o /dev/null -s -w "连接时间: %{time_connect}s\n首字节时间: %{time_starttransfer}s\n总时间: %{time_total}s\n" https://nftmaker.site
echo ""

# 检查重要文件
echo "📁 5. 重要文件检查"
echo "--------------------------------"
echo "robots.txt状态:"
curl -I -s -o /dev/null -w "%{http_code}" https://nftmaker.site/robots.txt
echo ""
echo "sitemap.xml状态:"
curl -I -s -o /dev/null -w "%{http_code}" https://nftmaker.site/sitemap.xml
echo ""

# 检查页面内容
echo "📄 6. 页面内容检查"
echo "--------------------------------"
PAGE_CONTENT=$(curl -s https://nftmaker.site)
if [[ $PAGE_CONTENT == *"NFT制作工具"* ]]; then
    echo "✅ 页面标题正常"
else
    echo "❌ 页面标题异常"
fi

if [[ $PAGE_CONTENT == *"React"* ]]; then
    echo "✅ React应用正常加载"
else
    echo "❌ React应用加载异常"
fi
echo ""

echo "🎉 检查完成！" 