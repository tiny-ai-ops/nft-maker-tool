# 🔐 身份认证系统集成指南

## 推荐方案对比

### 1. 🏆 Supabase (强烈推荐)
**免费额度**: 50,000 MAU  
**月费**: $25/月起  
**优势**: 
- ✅ 完整后端服务 (数据库 + 认证 + 存储)
- ✅ 中国访问稳定
- ✅ 一站式解决方案
- ✅ 开源，可自建

**适合**: 需要完整后端的项目

### 2. 🎨 Clerk (现代化)
**免费额度**: 10,000 MAU  
**月费**: $25/月起  
**优势**:
- ✅ UI组件精美
- ✅ 集成简单
- ✅ 用户体验优秀

**适合**: 注重UI/UX的项目

### 3. 🔥 Firebase (稳定)
**免费额度**: 较大  
**月费**: 按用量计费  
**优势**:
- ✅ Google出品
- ✅ 生态完善
- ❌ 中国访问不稳定

### 4. 🔒 Auth0 (企业级)
**免费额度**: 7,000 MAU  
**月费**: $23/月起  
**优势**:
- ✅ 企业级功能
- ✅ 安全性高
- ❌ 价格较高

## 🚀 快速开始 - Supabase集成

### 步骤 1: 创建Supabase项目
1. 访问 [https://supabase.com](https://supabase.com)
2. 注册并创建新项目
3. 获取项目URL和匿名密钥

### 步骤 2: 安装依赖
```bash
npm install @supabase/supabase-js
```

### 步骤 3: 环境配置
创建 `.env.local` 文件：
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 步骤 4: 配置Vite类型
在 `src/vite-env.d.ts` 中添加：
```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

### 步骤 5: 创建认证组件

#### 登录组件 (src/components/auth/LoginForm.tsx)
```tsx
import { useState } from 'react'
import { useAuthStore } from '../../stores/authStore'
import { toast } from 'react-hot-toast'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await signIn(email, password)
    
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('登录成功！')
    }
    
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          邮箱
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          密码
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          required
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full btn-primary"
      >
        {loading ? '登录中...' : '登录'}
      </button>
    </form>
  )
}
```

#### 注册组件 (src/components/auth/RegisterForm.tsx)
```tsx
import { useState } from 'react'
import { useAuthStore } from '../../stores/authStore'
import { toast } from 'react-hot-toast'

export default function RegisterForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      toast.error('密码不匹配')
      return
    }
    
    setLoading(true)
    const { error } = await signUp(email, password)
    
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('注册成功！请检查邮箱验证链接')
    }
    
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          邮箱
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          密码
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          minLength={6}
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          确认密码
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="input-field"
          required
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full btn-primary"
      >
        {loading ? '注册中...' : '注册'}
      </button>
    </form>
  )
}
```

### 步骤 6: 更新App.tsx初始化认证
```tsx
import { useEffect } from 'react'
import { useAuthStore } from './stores/authStore'

function App() {
  const { initialize, loading } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  if (loading) {
    return <div>加载中...</div>
  }

  // 其余App组件代码...
}
```

## 🔧 高级功能

### 1. 社交登录
```typescript
// Google登录
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google'
})

// GitHub登录
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'github'
})
```

### 2. 忘记密码
```typescript
const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: 'https://your-site.com/reset-password'
})
```

### 3. 数据库集成
在Supabase中创建`profiles`表来扩展用户信息：
```sql
create table profiles (
  id uuid references auth.users on delete cascade,
  updated_at timestamp with time zone,
  username text unique,
  avatar_url text,
  website text,
  primary key (id)
);
```

### 4. 文件存储
存储用户上传的NFT素材：
```typescript
const { data, error } = await supabase.storage
  .from('nft-assets')
  .upload('user-id/layer-1/trait.png', file)
```

## 💰 成本估算

### Supabase定价 (2024)
- **免费版**: 50,000 MAU, 500MB 数据库, 1GB 存储
- **Pro版**: $25/月, 100,000 MAU, 8GB 数据库, 100GB 存储

### 建议
1. **开发阶段**: 使用免费版
2. **上线初期**: 免费版够用
3. **用户增长**: 升级Pro版

## 🎯 实施建议

1. **先实现Supabase基础认证**
2. **添加用户个人资料页面**
3. **实现项目云端同步**
4. **添加协作功能（可选）**

这样你就有了一个完整的用户系统，包括注册、登录、密码重置等功能，而且完全不需要自己搭建邮件服务器！ 