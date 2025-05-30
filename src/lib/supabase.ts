import { createClient } from '@supabase/supabase-js'

// 使用实际的Supabase配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wfskcnydzduvyinmxmzy.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indmc2tjbnlkemR1dnlpbm14bXp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1Nzc0NjgsImV4cCI6MjA2NDE1MzQ2OH0.IpGhAWhc8jllh47ypZI7fFzHMoYYhdPF4G8y69p_4jA'

// 如果是占位符，提示用户需要配置
if (supabaseUrl === 'https://placeholder.supabase.co') {
  console.warn('⚠️ Supabase未配置: 请在.env.local中设置VITE_SUPABASE_URL和VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 检查配置是否有效
export const isSupabaseConfigured = supabaseUrl !== 'https://placeholder.supabase.co'

export default supabase 