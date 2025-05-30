import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, AlertCircle, Loader } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'
import { toast } from 'react-hot-toast'

export default function AuthCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const { initialize } = useAuthStore()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // 获取URL中的hash参数
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        const type = hashParams.get('type')

        if (type === 'signup' && accessToken) {
          // 邮箱验证成功
          setStatus('success')
          setMessage('邮箱验证成功！正在为您登录...')
          
          // 设置session
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken!
          })

          if (error) {
            throw error
          }

          // 重新初始化认证状态
          await initialize()
          
          toast.success('邮箱验证成功，欢迎使用NFT制作工具！')
          
          // 3秒后跳转到首页
          setTimeout(() => {
            navigate('/')
          }, 3000)
          
        } else if (type === 'recovery') {
          // 密码重置
          setStatus('success')
          setMessage('请设置新密码')
          setTimeout(() => {
            navigate('/reset-password')
          }, 2000)
        } else {
          // 无效的回调
          setStatus('error')
          setMessage('无效的验证链接')
          setTimeout(() => {
            navigate('/')
          }, 3000)
        }
      } catch (error: any) {
        console.error('Auth callback error:', error)
        setStatus('error')
        setMessage(error.message || '验证失败，请重试')
        setTimeout(() => {
          navigate('/')
        }, 3000)
      }
    }

    handleAuthCallback()
  }, [navigate, initialize])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
      >
        {status === 'loading' && (
          <>
            <Loader className="h-16 w-16 text-blue-500 mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">验证中</h2>
            <p className="text-gray-600">正在处理您的邮箱验证...</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">验证成功!</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Loader className="h-4 w-4 animate-spin" />
              <span>正在跳转...</span>
            </div>
          </>
        )}
        
        {status === 'error' && (
          <>
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">验证失败</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <button
              onClick={() => navigate('/')}
              className="btn-primary px-6 py-2"
            >
              返回首页
            </button>
          </>
        )}
      </motion.div>
    </div>
  )
} 