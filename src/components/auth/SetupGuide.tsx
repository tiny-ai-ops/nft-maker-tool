import { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Copy, Check, AlertCircle, BookOpen } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function SetupGuide() {
  const [copied, setCopied] = useState('')

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    toast.success('已复制到剪贴板')
    setTimeout(() => setCopied(''), 2000)
  }

  const steps = [
    {
      title: '1. 创建 Supabase 项目',
      description: '访问 Supabase 官网并创建新项目',
      action: (
        <a 
          href="https://supabase.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-primary inline-flex items-center space-x-2"
        >
          <ExternalLink className="h-4 w-4" />
          <span>前往 Supabase</span>
        </a>
      )
    },
    {
      title: '2. 获取项目配置',
      description: '在项目设置中找到 URL 和 anon key',
      action: (
        <div className="text-sm text-gray-600">
          项目设置 → API → Project URL & anon key
        </div>
      )
    },
    {
      title: '3. 创建环境变量文件',
      description: '在项目根目录创建 .env.local 文件',
      action: (
        <div className="space-y-3">
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400"># .env.local</span>
              <button
                onClick={() => copyToClipboard(`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here`, 'env')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {copied === 'env' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <div>VITE_SUPABASE_URL=https://your-project.supabase.co</div>
            <div>VITE_SUPABASE_ANON_KEY=your-anon-key-here</div>
          </div>
          <div className="text-xs text-gray-500">
            将 your-project 和 your-anon-key-here 替换为实际值
          </div>
        </div>
      )
    },
    {
      title: '4. 重启开发服务器',
      description: '保存文件后重启服务器以加载环境变量',
      action: (
        <div className="bg-gray-100 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <code className="text-sm">npm run dev</code>
            <button
              onClick={() => copyToClipboard('npm run dev', 'command')}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              {copied === 'command' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>
      )
    }
  ]

  return (
    <motion.div 
      className="card max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-center mb-8">
        <div className="h-16 w-16 bg-gradient-to-br from-orange-500 to-red-600 
                      rounded-3xl flex items-center justify-center shadow-xl shadow-orange-500/25 
                      mx-auto mb-6">
          <AlertCircle className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold gradient-text mb-4">配置身份认证服务</h2>
        <p className="text-gray-600">
          需要配置 Supabase 才能使用完整的用户认证功能
        </p>
      </div>

      <div className="space-y-8">
        {steps.map((step, index) => (
          <motion.div 
            key={index}
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full 
                            flex items-center justify-center font-semibold text-sm">
                {index + 1}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {step.description}
                </p>
                {step.action}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="absolute left-4 top-10 w-px h-12 bg-gray-200" />
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200/50">
        <div className="flex items-center space-x-3 text-blue-600">
          <BookOpen className="h-5 w-5" />
          <span className="font-semibold">详细文档</span>
        </div>
        <p className="text-gray-600 mt-2">
          查看项目根目录的 <code className="bg-gray-100 px-2 py-1 rounded text-sm">AUTHENTICATION_SETUP.md</code> 
          文件获取完整的集成指南。
        </p>
      </div>
    </motion.div>
  )
} 