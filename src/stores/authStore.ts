import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '../types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (activationCode: string) => Promise<boolean>
  logout: () => void
}

// 预设的激活码（实际项目中应该从后端验证）
const VALID_ACTIVATION_CODES = [
  'NFT2024-MAKER-001',
  'NFT2024-MAKER-002',
  'NFT2024-MAKER-003',
  'NFT2024-PREMIUM',
  'NFT2024-BETA'
]

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      login: async (activationCode: string) => {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        if (VALID_ACTIVATION_CODES.includes(activationCode)) {
          const user: User = {
            id: `user_${Date.now()}`,
            email: `user@nftmaker.com`,
            activated: true,
            activationCode
          }
          
          set({ user, isAuthenticated: true })
          return true
        }
        
        return false
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false })
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
) 