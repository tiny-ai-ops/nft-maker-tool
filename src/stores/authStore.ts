import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { User, Session } from '@supabase/supabase-js'
import { toast } from 'react-hot-toast'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<{ error?: any }>
  signIn: (email: string, password: string) => Promise<{ error?: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error?: any }>
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      loading: true,
      
      signUp: async (email: string, password: string) => {
        if (!isSupabaseConfigured) {
          return { 
            error: { 
              message: '请先配置Supabase。参考 AUTHENTICATION_SETUP.md 文档进行配置。' 
            } 
          }
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })
        
        if (data.user) {
          set({ user: data.user, session: data.session })
        }
        
        return { error }
      },
      
      signIn: async (email: string, password: string) => {
        if (!isSupabaseConfigured) {
          return { 
            error: { 
              message: '请先配置Supabase。参考 AUTHENTICATION_SETUP.md 文档进行配置。' 
            } 
          }
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        if (data.user) {
          set({ user: data.user, session: data.session })
        }
        
        return { error }
      },
      
      signOut: async () => {
        if (isSupabaseConfigured) {
          await supabase.auth.signOut()
        }
        set({ user: null, session: null })
      },
      
      resetPassword: async (email: string) => {
        if (!isSupabaseConfigured) {
          return { 
            error: { 
              message: '请先配置Supabase。参考 AUTHENTICATION_SETUP.md 文档进行配置。' 
            } 
          }
        }

        const { error } = await supabase.auth.resetPasswordForEmail(email)
        return { error }
      },
      
      initialize: async () => {
        set({ loading: true })
        
        if (!isSupabaseConfigured) {
          // 如果Supabase未配置，显示配置提示并结束加载
          toast.error('请配置Supabase认证服务', {
            duration: 5000,
            position: 'top-center'
          })
          set({ loading: false })
          return
        }
        
        try {
          const { data: { session } } = await supabase.auth.getSession()
          
          if (session) {
            set({ user: session.user, session })
          }
          
          // 监听认证状态变化
          supabase.auth.onAuthStateChange((_event: any, session: any) => {
            if (session) {
              set({ user: session.user, session })
            } else {
              set({ user: null, session: null })
            }
          })
        } catch (error) {
          console.error('认证初始化失败:', error)
        }
        
        set({ loading: false })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        session: state.session 
      }),
    }
  )
) 