import { createClient } from '@supabase/supabase-js'

// 使用实际的Supabase配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wfskcnydzduvyinmxmzy.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indmc2tjbnlkemR1dnlpbm14bXp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1Nzc0NjgsImV4cCI6MjA2NDE1MzQ2OH0.IpGhAWhc8jllh47ypZI7fFzHMoYYhdPF4G8y69p_4jA'

// 如果是占位符，提示用户需要配置
if (supabaseUrl === 'https://placeholder.supabase.co') {
  console.warn('⚠️ Supabase未配置: 请在.env.local中设置VITE_SUPABASE_URL和VITE_SUPABASE_ANON_KEY')
}

// 创建Supabase客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'nft-maker-tool'
    }
  }
})

// 检查配置是否有效
export const isSupabaseConfigured = supabaseUrl !== 'https://placeholder.supabase.co'

export default supabase

// 连接状态检查
export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('health_check').select('*').limit(1)
    if (error && error.code !== 'PGRST116') { // PGRST116 是表不存在的错误，这是正常的
      console.warn('Supabase连接检查警告:', error.message)
    }
    return true
  } catch (error) {
    console.error('Supabase连接失败:', error)
    return false
  }
}

// 带错误处理的认证方法
export async function signInWithSupabase(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) {
      // 处理常见的认证错误
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('邮箱或密码错误')
      }
      if (error.message.includes('Email not confirmed')) {
        throw new Error('请先验证邮箱')
      }
      if (error.message.includes('Too many requests')) {
        throw new Error('请求过于频繁，请稍后再试')
      }
      throw new Error(error.message)
    }
    
    return data
  } catch (error: any) {
    // 网络错误处理
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('网络连接失败，请检查网络设置或稍后重试')
    }
    if (error.code === 'NETWORK_ERROR') {
      throw new Error('网络错误，无法连接到服务器')
    }
    throw error
  }
}

// 带错误处理的注册方法
export async function signUpWithSupabase(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })
    
    if (error) {
      if (error.message.includes('User already registered')) {
        throw new Error('该邮箱已被注册')
      }
      if (error.message.includes('Password should be at least')) {
        throw new Error('密码至少需要6位')
      }
      throw new Error(error.message)
    }
    
    return data
  } catch (error: any) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('网络连接失败，请检查网络设置或稍后重试')
    }
    throw error
  }
}

// 重新发送确认邮件
export async function resendConfirmationEmail(email: string) {
  try {
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email: email
    })
    
    if (error) {
      if (error.message.includes('Email rate limit exceeded')) {
        throw new Error('发送过于频繁，请稍后再试')
      }
      if (error.message.includes('User not found')) {
        throw new Error('邮箱地址不存在')
      }
      throw new Error(error.message)
    }
    
    return data
  } catch (error: any) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('网络连接失败，请检查网络设置或稍后重试')
    }
    throw error
  }
}

// 检查邮箱确认状态
export async function checkEmailConfirmationStatus(email: string) {
  try {
    // 尝试获取用户信息
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      return { confirmed: false, error: error.message }
    }
    
    if (user && user.email === email) {
      return { confirmed: user.email_confirmed_at !== null, user }
    }
    
    return { confirmed: false, error: '用户未登录' }
  } catch (error: any) {
    return { confirmed: false, error: error.message }
  }
}

// 优雅的错误处理包装器
export function withSupabaseErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args)
    } catch (error: any) {
      // 记录错误但不阻止应用运行
      console.error('Supabase操作失败:', error)
      
      // 如果是网络相关错误，提供友好的错误信息
      if (error.name === 'TypeError' || error.code === 'NETWORK_ERROR') {
        throw new Error('网络连接问题，请检查网络设置后重试')
      }
      
      throw error
    }
  }
}

// 检查连接状态并在页面加载时显示警告
if (typeof window !== 'undefined') {
  // 延迟检查，避免阻塞页面加载
  setTimeout(async () => {
    const isConnected = await checkSupabaseConnection()
    if (!isConnected) {
      console.warn('⚠️ Supabase服务连接异常，某些功能可能无法正常使用')
      // 可以在这里显示用户友好的提示
    }
  }, 3000)
} 