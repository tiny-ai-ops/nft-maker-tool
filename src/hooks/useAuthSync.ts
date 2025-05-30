import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'

export function useAuthSync() {
  const { refreshAuthState } = useAuthStore()

  useEffect(() => {
    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          // 登录或token刷新时更新状态
          await refreshAuthState()
        } else if (event === 'SIGNED_OUT') {
          // 登出时清空状态
          await refreshAuthState()
        }
      }
    )

    // 监听页面可见性变化（切换标签页时）
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // 页面变为可见时刷新认证状态
        setTimeout(refreshAuthState, 500)
      }
    }

    // 监听窗口焦点变化
    const handleFocus = () => {
      setTimeout(refreshAuthState, 500)
    }

    // 监听storage变化（跨标签页同步）
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.includes('auth-storage')) {
        setTimeout(refreshAuthState, 500)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)
    window.addEventListener('storage', handleStorageChange)

    return () => {
      subscription.unsubscribe()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [refreshAuthState])
} 