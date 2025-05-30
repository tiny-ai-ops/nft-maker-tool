import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, Clock } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/authStore'
import { toast } from 'react-hot-toast'

interface EmailVerificationCheckerProps {
  email: string
  onVerified?: () => void
}

export default function EmailVerificationChecker({ onVerified }: EmailVerificationCheckerProps) {
  const [checking, setChecking] = useState(false)
  const [lastCheck, setLastCheck] = useState<Date | null>(null)
  const { initialize } = useAuthStore()

  // 检查邮箱验证状态
  const checkVerificationStatus = async () => {
    setChecking(true)
    try {
      // 刷新session以获取最新状态
      const { data, error } = await supabase.auth.refreshSession()
      
      if (error) {
        throw error
      }

      if (data.user?.email_confirmed_at) {
        // 邮箱已验证
        toast.success('邮箱验证成功！')
        await initialize() // 重新初始化认证状态
        onVerified?.()
      } else {
        toast('邮箱尚未验证，请检查您的邮箱', {
          icon: '📧',
          duration: 3000
        })
      }
      
      setLastCheck(new Date())
    } catch (error: any) {
      console.error('检查验证状态失败:', error)
      toast.error('检查状态失败，请稍后重试')
    } finally {
      setChecking(false)
    }
  }

  // 页面可见性变化时自动检查
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // 页面变为可见时检查状态（比如从手机切换回电脑）
        setTimeout(checkVerificationStatus, 1000)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  // 定期自动检查（可选）
  useEffect(() => {
    const interval = setInterval(() => {
      checkVerificationStatus()
    }, 30000) // 每30秒检查一次

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Clock className="h-5 w-5 text-blue-600" />
          <div>
            <h4 className="text-sm font-medium text-blue-800">等待邮箱验证</h4>
            <p className="text-xs text-blue-600">
              在其他设备验证了邮箱？点击检查状态
            </p>
          </div>
        </div>
        
        <button
          onClick={checkVerificationStatus}
          disabled={checking}
          className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {checking ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>检查中...</span>
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              <span>检查状态</span>
            </>
          )}
        </button>
      </div>
      
      {lastCheck && (
        <div className="mt-2 text-xs text-blue-500">
          上次检查: {lastCheck.toLocaleTimeString()}
        </div>
      )}
      
      <div className="mt-3 text-xs text-blue-600 bg-blue-100 rounded px-3 py-2">
        <strong>提示:</strong> 
        <ul className="mt-1 list-disc list-inside space-y-1">
          <li>在手机上验证了邮箱？点击"检查状态"按钮</li>
          <li>系统会在您切换回此页面时自动检查</li>
          <li>也可以刷新页面来同步最新状态</li>
        </ul>
      </div>
    </motion.div>
  )
} 