import { createClient } from '@supabase/supabase-js'

// 检查是否有环境变量，如果没有则使用占位符
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

// 如果是占位符，提示用户需要配置
if (supabaseUrl === 'https://placeholder.supabase.co') {
  console.warn('⚠️ Supabase未配置: 请在.env.local中设置VITE_SUPABASE_URL和VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 模拟认证状态（仅用于演示）
export const isSupabaseConfigured = supabaseUrl !== 'https://placeholder.supabase.co'

export default supabase 