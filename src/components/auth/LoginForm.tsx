import { useState } from 'react'
import { useAuthStore } from '../../stores/authStore'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { signIn } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await signIn(email, password)
    
    if (error) {
      toast.error(error.message || '登录失败，请检查邮箱和密码')
    } else {
      toast.success('登录成功！')
    }
    
    setLoading(false)
  }

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4" />
            <span>邮箱地址</span>
          </div>
        </label>
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field pl-12"
            placeholder="请输入您的邮箱"
            required
          />
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          <div className="flex items-center space-x-2">
            <Lock className="h-4 w-4" />
            <span>密码</span>
          </div>
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field pl-12 pr-12"
            placeholder="请输入您的密码"
            required
          />
          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>
      
      <motion.button
        type="submit"
        disabled={loading || !email || !password}
        className="w-full btn-primary flex items-center justify-center space-x-3 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>登录中...</span>
          </>
        ) : (
          <>
            <LogIn className="h-5 w-5" />
            <span>立即登录</span>
          </>
        )}
      </motion.button>
    </motion.form>
  )
} 