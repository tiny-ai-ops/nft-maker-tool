import { useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import { toast } from 'react-hot-toast'
import { KeyRound, Sparkles } from 'lucide-react'

export default function LoginPage() {
  const [activationCode, setActivationCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!activationCode.trim()) {
      toast.error('请输入激活码')
      return
    }

    setIsLoading(true)
    
    try {
      const success = await login(activationCode)
      
      if (success) {
        toast.success('登录成功！欢迎使用NFT制作工具')
      } else {
        toast.error('激活码无效，请检查后重试')
      }
    } catch (error) {
      toast.error('登录失败，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo和标题 */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">NFT制作工具</h2>
          <p className="text-gray-600">输入激活码开始创建您的NFT项目</p>
        </div>

        {/* 登录表单 */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="activationCode" className="block text-sm font-medium text-gray-700 mb-2">
                激活码
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="activationCode"
                  type="text"
                  placeholder="请输入您的激活码"
                  value={activationCode}
                  onChange={(e) => setActivationCode(e.target.value)}
                  className="input-field pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '验证中...' : '开始使用'}
            </button>
          </form>

          {/* 示例激活码提示 */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">测试激活码：</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="font-mono bg-white px-2 py-1 rounded">NFT2024-MAKER-001</div>
              <div className="font-mono bg-white px-2 py-1 rounded">NFT2024-PREMIUM</div>
              <div className="font-mono bg-white px-2 py-1 rounded">NFT2024-BETA</div>
            </div>
          </div>
        </div>

        {/* 功能特色 */}
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">产品特色</h3>
          <div className="grid grid-cols-1 gap-3 text-sm text-gray-600">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>图层管理与稀有度设置</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>实时预览与批量生成</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>自动生成JSON元数据</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 