import { useState } from 'react'
import { useAuthStore } from '../../stores/authStore'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Mail, Lock, UserPlus, Eye, EyeOff, Check, X } from 'lucide-react'
import EmailConfirmationAlert from './EmailConfirmationAlert'

export default function RegisterForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false)
  const { signUp } = useAuthStore()

  const passwordsMatch = password === confirmPassword && confirmPassword !== ''
  const passwordValid = password.length >= 6

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!passwordValid) {
      toast.error('密码至少需要6位字符')
      return
    }
    
    if (!passwordsMatch) {
      toast.error('密码不匹配')
      return
    }
    
    setLoading(true)
    const { error } = await signUp(email, password)
    
    if (error) {
      toast.error(error.message || '注册失败，请重试')
      setShowEmailConfirmation(false)
    } else {
      toast.success('注册成功！请检查邮箱验证链接')
      setShowEmailConfirmation(true)
    }
    
    setLoading(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {showEmailConfirmation && (
        <EmailConfirmationAlert 
          email={email}
          onClose={() => setShowEmailConfirmation(false)}
        />
      )}

      <form 
        onSubmit={handleSubmit} 
        className="space-y-6"
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
              className={`input-field pl-12 pr-12 ${
                password && (passwordValid ? 'border-green-400 focus:border-green-500' : 'border-red-400 focus:border-red-500')
              }`}
              placeholder="请输入密码（至少6位）"
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
          {password && (
            <div className="mt-2 flex items-center space-x-2 text-sm">
              {passwordValid ? (
                <>
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-green-600">密码长度符合要求</span>
                </>
              ) : (
                <>
                  <X className="h-4 w-4 text-red-500" />
                  <span className="text-red-600">密码至少需要6位字符</span>
                </>
              )}
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            <div className="flex items-center space-x-2">
              <Lock className="h-4 w-4" />
              <span>确认密码</span>
            </div>
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`input-field pl-12 pr-12 ${
                confirmPassword && (passwordsMatch ? 'border-green-400 focus:border-green-500' : 'border-red-400 focus:border-red-500')
              }`}
              placeholder="请再次输入密码"
              required
            />
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {confirmPassword && (
            <div className="mt-2 flex items-center space-x-2 text-sm">
              {passwordsMatch ? (
                <>
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-green-600">密码匹配</span>
                </>
              ) : (
                <>
                  <X className="h-4 w-4 text-red-500" />
                  <span className="text-red-600">密码不匹配</span>
                </>
              )}
            </div>
          )}
        </div>
        
        <motion.button
          type="submit"
          disabled={loading || !email || !passwordValid || !passwordsMatch}
          className="w-full btn-primary flex items-center justify-center space-x-3 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>注册中...</span>
            </>
          ) : (
            <>
              <UserPlus className="h-5 w-5" />
              <span>立即注册</span>
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  )
} 