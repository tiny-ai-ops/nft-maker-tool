# Supabase URL 配置指南

## 问题描述
邮箱验证链接点击后跳转到本地开发地址（如 localhost:5173），而不是生产环境地址。

## 解决方案

### 1. 登录 Supabase Dashboard
访问：https://supabase.com/dashboard
使用您的账户登录

### 2. 选择您的项目
找到项目：`wfskcnydzduvyinmxmzy`（或您的项目名称）

### 3. 进入认证设置
1. 点击左侧菜单的 **Authentication**
2. 点击 **URL Configuration**

### 4. 修改 Site URL
将 **Site URL** 从：
```
http://localhost:5173
```
修改为：
```
https://nftmaker.site
```

### 5. 配置 Redirect URLs
在 **Redirect URLs** 部分添加以下URL：
```
https://nftmaker.site
https://nftmaker.site/**
https://www.nftmaker.site
https://www.nftmaker.site/**
```

### 6. 保存设置
点击 **Save** 保存配置

## 验证配置
配置完成后：
1. 重新发送邮箱验证邮件
2. 点击邮件中的验证链接
3. 应该跳转到 https://nftmaker.site

## 注意事项
- 配置更改可能需要几分钟才能生效
- 如果仍有问题，请清除浏览器缓存后重试
- 确保域名 nftmaker.site 可以正常访问

## 附加配置（可选）

### 自定义邮件模板
您也可以在 **Email Templates** 中自定义验证邮件的外观和内容：

1. 进入 **Authentication** > **Email Templates**
2. 选择 **Confirm signup**
3. 自定义邮件内容，确保链接指向正确的域名

### 域名验证
如果需要验证域名所有权：
1. 进入 **Authentication** > **URL Configuration**
2. 在 **Additional Redirect URLs** 中添加所有需要的回调URL

## 完成
配置完成后，所有邮箱验证链接都会正确跳转到生产环境地址！ 