import { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle, WifiOff, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { checkSupabaseConnection } from '../lib/supabase'

interface NetworkStatusProps {
  className?: string
}

export default function NetworkStatus({ className = '' }: NetworkStatusProps) {
  const [supabaseStatus, setSupabaseStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking')
  const [gaStatus, setGaStatus] = useState<'checking' | 'connected' | 'blocked'>('checking')
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    checkConnections()
  }, [])

  const checkConnections = async () => {
    // 检查Supabase连接
    const supabaseConnected = await checkSupabaseConnection()
    setSupabaseStatus(supabaseConnected ? 'connected' : 'disconnected')

    // 检查Google Analytics状态
    setTimeout(() => {
      const gaAvailable = !!(window as any).gtag && !!(window as any).dataLayer
      setGaStatus(gaAvailable ? 'connected' : 'blocked')
    }, 2000)
  }

  const hasIssues = supabaseStatus === 'disconnected' || gaStatus === 'blocked'

  if (!hasIssues) {
    return null // 如果一切正常，不显示状态组件
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'checking':
        return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'disconnected':
      case 'blocked':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <WifiOff className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusText = (service: string, status: string) => {
    if (status === 'checking') return '检查中...'
    if (status === 'connected') return '正常'
    
    if (service === 'supabase') {
      return '连接失败'
    }
    if (service === 'ga') {
      return '被阻止'
    }
    return '异常'
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`relative ${className}`}
      >
        {/* 主要状态指示器 */}
        <motion.button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center space-x-2 px-3 py-2 bg-amber-50 border border-amber-200 
                   rounded-lg hover:bg-amber-100 transition-colors cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <WifiOff className="h-4 w-4 text-amber-600" />
          <span className="text-sm font-medium text-amber-800">
            网络状态异常
          </span>
        </motion.button>

        {/* 详细状态面板 */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl 
                       border border-gray-200 p-4 z-50 min-w-80"
            >
              <h4 className="font-medium text-gray-900 mb-3">网络连接状态</h4>
              
              <div className="space-y-3">
                {/* Supabase状态 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(supabaseStatus)}
                    <span className="text-sm text-gray-700">用户认证服务</span>
                  </div>
                  <span className={`text-sm font-medium ${
                    supabaseStatus === 'connected' ? 'text-green-600' : 
                    supabaseStatus === 'checking' ? 'text-blue-600' : 'text-red-600'
                  }`}>
                    {getStatusText('supabase', supabaseStatus)}
                  </span>
                </div>

                {/* Google Analytics状态 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(gaStatus)}
                    <span className="text-sm text-gray-700">数据分析服务</span>
                  </div>
                  <span className={`text-sm font-medium ${
                    gaStatus === 'connected' ? 'text-green-600' : 
                    gaStatus === 'checking' ? 'text-blue-600' : 'text-amber-600'
                  }`}>
                    {getStatusText('ga', gaStatus)}
                  </span>
                </div>

                {/* 状态说明 */}
                <div className="border-t border-gray-200 pt-3 space-y-2">
                  {supabaseStatus === 'disconnected' && (
                    <div className="p-2 bg-red-50 rounded text-sm text-red-700">
                      <strong>用户功能受限：</strong> 登录/注册功能可能无法使用
                    </div>
                  )}
                  
                  {gaStatus === 'blocked' && (
                    <div className="p-2 bg-amber-50 rounded text-sm text-amber-700">
                      <strong>分析功能受限：</strong> 可能是广告拦截器或网络限制
                    </div>
                  )}
                </div>

                {/* 操作按钮 */}
                <div className="flex space-x-2 pt-2">
                  <button
                    onClick={checkConnections}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg 
                             hover:bg-blue-700 transition-colors text-sm"
                  >
                    重新检查
                  </button>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg 
                             hover:bg-gray-200 transition-colors text-sm"
                  >
                    关闭
                  </button>
                </div>

                {/* 帮助信息 */}
                <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                  💡 这些问题不会影响NFT制作功能的正常使用
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
} 