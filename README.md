# NFT制作工具

一个功能完整的NFT生成和管理工具，支持图层管理、稀有度设置、批量生成和metadata导出。

## 🚀 功能特性

### ✅ 已实现功能

- **用户权限系统**
  - 激活码登录验证
  - 多个预设激活码支持

- **项目管理**
  - 创建、编辑、删除NFT项目
  - 项目设置（画布尺寸、背景色等）
  - 项目数据持久化存储

- **图层管理**
  - 创建和删除图层
  - 图层顺序调整（拖拽排序、上移下移按钮）
  - 图层可见性控制
  - 支持多种图片格式（PNG、JPG、GIF）

- **素材管理**
  - 拖拽上传图片素材
  - 素材预览和删除
  - 每个图层支持多个素材

- **稀有度设置**
  - 独立的稀有度编辑器
  - 目标稀有度和权重设置
  - 实际稀有度计算和预览
  - 权重平均分配功能
  - 稀有度分布预览

- **实时预览**
  - Canvas实时渲染
  - 随机组合生成
  - 基于权重的智能选择
  - 当前组合信息显示

- **导出功能**
  - 单个预览图下载
  - 单个metadata JSON下载
  - 批量NFT生成
  - 批量图片下载
  - 批量metadata下载
  - 生成报告导出

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **状态管理**: Zustand
- **图标**: Lucide React
- **通知**: React Hot Toast
- **路由**: React Router DOM

## 📦 安装和运行

### 环境要求
- Node.js 16+ 
- npm 或 yarn

### 安装步骤

1. 克隆项目
```bash
git clone <repository-url>
cd nftmaker
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 打开浏览器访问 `http://localhost:3000`

## 🎯 使用指南

### 1. 登录系统
使用以下任一激活码登录：
- `NFT2024-MAKER-001`
- `NFT2024-MAKER-002`
- `NFT2024-MAKER-003`
- `PREMIUM-NFT-2024`
- `CREATOR-ACCESS-001`

### 2. 创建项目
1. 点击"创建新项目"
2. 输入项目名称和描述
3. 设置画布尺寸（默认1000x1000）

### 3. 管理图层
1. **创建图层**: 点击"新建图层"按钮
2. **调整顺序**: 
   - 使用上移/下移按钮
   - 或直接拖拽图层重新排序
3. **上传素材**: 拖拽图片到图层区域或点击上传
4. **控制可见性**: 点击眼睛图标显示/隐藏图层

### 4. 设置稀有度
1. 在稀有度设置面板选择图层
2. 调整每个素材的目标稀有度（%）
3. 或直接设置权重值
4. 使用"平均分配"快速平衡权重
5. 查看稀有度分布预览

### 5. 预览和测试
1. 点击"随机组合"生成不同的NFT组合
2. 查看当前组合的特征信息
3. 下载预览图片和metadata JSON

### 6. 批量生成
1. 设置生成数量（1-10000）
2. 配置集合名称和描述
3. 设置基础Token URI
4. 点击"生成"开始批量生成
5. 下载图片、metadata或生成报告

## 📁 项目结构

```
src/
├── components/          # React组件
│   ├── LayerManager.tsx    # 图层管理
│   ├── NFTPreview.tsx      # 预览组件
│   ├── BatchGenerator.tsx  # 批量生成
│   ├── RarityEditor.tsx    # 稀有度编辑
│   └── Navbar.tsx          # 导航栏
├── pages/              # 页面组件
│   ├── LoginPage.tsx       # 登录页
│   ├── Dashboard.tsx       # 仪表板
│   ├── CreateProject.tsx   # 创建项目
│   └── ProjectEditor.tsx   # 项目编辑器
├── stores/             # 状态管理
│   ├── authStore.ts        # 认证状态
│   └── projectStore.ts     # 项目状态
├── types/              # TypeScript类型
│   └── index.ts
└── App.tsx             # 主应用
```

## 🎨 NFT Metadata格式

生成的metadata遵循OpenSea标准：

```json
{
  "name": "Collection Name #1",
  "description": "NFT description",
  "image": "https://your-domain.com/metadata/1.png",
  "attributes": [
    {
      "trait_type": "Background",
      "value": "Blue",
      "rarity": 10.5
    },
    {
      "trait_type": "Character",
      "value": "Robot",
      "rarity": 5.2
    }
  ]
}
```

## 🔧 配置说明

### 项目设置
- **画布尺寸**: 推荐1000x1000像素
- **背景色**: 支持十六进制颜色代码
- **输出格式**: PNG（推荐）或JPG

### 稀有度计算
- 权重越高，出现概率越大
- 实际稀有度 = (素材权重 / 图层总权重) × 100%
- 支持0.1%-100%的稀有度设置

## 🚀 部署

### 构建生产版本
```bash
npm run build
```

### 预览构建结果
```bash
npm run preview
```

## 📝 开发说明

### 添加新功能
1. 在`src/components/`创建新组件
2. 在`src/stores/`添加状态管理
3. 在`src/types/`定义TypeScript类型
4. 更新路由配置

### 数据存储
- 使用Zustand进行状态管理
- 数据持久化到localStorage
- 支持项目导入/导出（计划中）

## 🐛 已知问题

- 大批量生成时可能出现内存占用较高
- 建议单次生成不超过1000个NFT
- 图片文件建议控制在2MB以内

## 🔮 未来计划

- [ ] 项目导入/导出功能
- [ ] 更多图片格式支持
- [ ] 批量上传优化
- [ ] 智能去重功能
- [ ] 区块链集成
- [ ] IPFS存储支持

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request！

---

**享受创建独特NFT的过程！** 🎨✨ 