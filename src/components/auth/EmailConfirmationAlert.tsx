import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { resendConfirmationEmail } from '../../lib/supabase'
import EmailVerificationChecker from './EmailVerificationChecker'

interface EmailConfirmationAlertProps {
  email: string
  onClose?: () => void
}

export default function EmailConfirmationAlert({ email, onClose }: EmailConfirmationAlertProps) {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleResendEmail = async () => {
    setLoading(true)
    try {
      await resendConfirmationEmail(email)
      setSent(true)
      toast.success('确认邮件已发送，请检查您的邮箱')
    } catch (error: any) {
      toast.error(error.message || '发送确认邮件失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4"
    >
      <div className="flex items-start space-x-3">
        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-yellow-800 mb-2">
            邮箱需要验证
          </h3>
          <p className="text-sm text-yellow-700 mb-4">
            您的邮箱 <span className="font-medium">{email}</span> 尚未验证。
            请检查您的邮箱并点击确认链接，或重新发送确认邮件。
          </p>
          
          {!sent ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleResendEmail}
                disabled={loading}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>发送中...</span>
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    <span>重新发送确认邮件</span>
                  </>
                )}
              </button>
              
              {onClose && (
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-yellow-700 hover:text-yellow-900 transition-colors"
                >
                  稍后处理
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-green-700">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">确认邮件已发送！请检查您的邮箱（包括垃圾邮件文件夹）</span>
            </div>
          )}
          
          <div className="mt-3 text-xs text-yellow-600 bg-yellow-100 rounded px-3 py-2">
            <strong>提示:</strong> 如果您没有收到邮件，请检查垃圾邮件文件夹，或确认邮箱地址是否正确。
            某些邮箱服务商可能会延迟发送确认邮件。
          </div>
        </div>
      </div>
      
      <EmailVerificationChecker 
        email={email} 
        onVerified={() => {
          toast.success('邮箱验证成功！')
          onClose?.()
        }}
      />
    </motion.div>
  )
} 