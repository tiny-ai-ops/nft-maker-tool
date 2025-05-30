import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Sparkles, Settings } from 'lucide-react'
import LoginForm from '../components/auth/LoginForm'
import RegisterForm from '../components/auth/RegisterForm'
import SetupGuide from '../components/auth/SetupGuide'
import { isSupabaseConfigured } from '../lib/supabase'

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'setup'>('login')

  const tabVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  }

  // 如果Supabase未配置，默认显示设置向导
  if (!isSupabaseConfigured && activeTab !== 'setup') {
    setActiveTab('setup')
  }

  return (
    <div className="min-h-screen hero-section">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {activeTab === 'setup' ? (
            <div className="space-y-8">
              {/* 品牌Logo */}
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center justify-center space-x-3 mb-6">
                  <div className="h-16 w-16 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 
                                rounded-3xl flex items-center justify-center shadow-xl shadow-blue-500/25 floating-animation">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h1 className="text-4xl font-bold gradient-text mb-2">NFT Maker</h1>
                <p className="text-gray-600">首次使用需要配置认证服务</p>
              </motion.div>
              
              <SetupGuide />
              
              {/* 跳过配置选项 */}
              <motion.div 
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-gray-500 text-sm mb-4">
                  或者先体验演示版（功能受限）
                </p>
                <button
                  onClick={() => setActiveTab('login')}
                  className="btn-secondary"
                >
                  跳过配置，继续体验
                </button>
              </motion.div>
            </div>
          ) : (
            <div className="w-full max-w-md mx-auto">
              {/* 品牌Logo */}
              <motion.div 
                className="text-center mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center justify-center space-x-3 mb-6">
                  <div className="h-16 w-16 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 
                                rounded-3xl flex items-center justify-center shadow-xl shadow-blue-500/25 floating-animation">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h1 className="text-4xl font-bold gradient-text mb-2">NFT Maker</h1>
                <p className="text-gray-600">开始您的NFT创作之旅</p>
              </motion.div>

              {/* 认证卡片 */}
              <motion.div 
                className="card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {/* 配置提醒 */}
                {!isSupabaseConfigured && (
                  <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Settings className="h-5 w-5 text-orange-600" />
                      <div className="flex-1">
                        <p className="text-sm text-orange-800 font-medium">演示模式</p>
                        <p className="text-xs text-orange-600">
                          认证功能受限，
                          <button
                            onClick={() => setActiveTab('setup')}
                            className="underline font-semibold ml-1"
                          >
                            点击配置完整功能
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 标签切换 */}
                <div className="flex mb-8 bg-gray-100/50 rounded-xl p-1">
                  <button
                    onClick={() => setActiveTab('login')}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold text-center transition-all duration-300 ${
                      activeTab === 'login'
                        ? 'bg-white text-blue-600 shadow-lg'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    登录
                  </button>
                  <button
                    onClick={() => setActiveTab('register')}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold text-center transition-all duration-300 ${
                      activeTab === 'register'
                        ? 'bg-white text-blue-600 shadow-lg'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    注册
                  </button>
                </div>

                {/* 表单内容 */}
                <AnimatePresence mode="wait">
                  {activeTab === 'login' ? (
                    <motion.div
                      key="login"
                      variants={tabVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.3 }}
                    >
                      <LoginForm />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="register"
                      variants={tabVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.3 }}
                    >
                      <RegisterForm />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 底部链接 */}
                <div className="mt-8 pt-6 border-t border-gray-200/50 text-center">
                  {activeTab === 'login' ? (
                    <p className="text-gray-600">
                      还没有账户？{' '}
                      <button
                        onClick={() => setActiveTab('register')}
                        className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                      >
                        立即注册
                      </button>
                    </p>
                  ) : (
                    <p className="text-gray-600">
                      已经有账户？{' '}
                      <button
                        onClick={() => setActiveTab('login')}
                        className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                      >
                        立即登录
                      </button>
                    </p>
                  )}
                </div>
              </motion.div>

              {/* 特色说明 */}
              <motion.div 
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-4 w-4" />
                    <span>简单易用</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4" />
                    <span>快速生成</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" />
                    <span>云端同步</span>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 