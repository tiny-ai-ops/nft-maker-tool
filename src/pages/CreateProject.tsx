import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProjectStore } from '../stores/projectStore'
import { toast } from 'react-hot-toast'
import { ArrowLeft, Folder } from 'lucide-react'

export default function CreateProject() {
  const navigate = useNavigate()
  const { createProject } = useProjectStore()
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error('请输入项目名称')
      return
    }

    setIsLoading(true)
    
    try {
      const newProject = createProject(formData.name, formData.description)
      toast.success('项目创建成功！')
      navigate(`/project/${newProject.id}`)
    } catch (error) {
      toast.error('创建项目失败，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 返回按钮 */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors duration-200"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>返回项目列表</span>
      </button>

      {/* 页面标题 */}
      <div className="text-center mb-8">
        <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
          <Folder className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">创建新项目</h1>
        <p className="text-gray-600">设置您的NFT项目基本信息，开始创作之旅</p>
      </div>

      {/* 创建表单 */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              项目名称 *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="例如：我的NFT收藏品"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              disabled={isLoading}
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              为您的NFT项目起一个独特的名称
            </p>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              项目描述
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="描述您的NFT项目特色、主题或背景故事..."
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="input-field resize-none"
              disabled={isLoading}
            />
            <p className="mt-1 text-xs text-gray-500">
              详细描述有助于更好地组织和管理您的项目
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">项目默认设置</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 画布尺寸：1000 x 1000 像素</li>
              <li>• 目标生成数量：10,000 个</li>
              <li>• 输出格式：PNG</li>
              <li>• 背景颜色：白色</li>
            </ul>
            <p className="text-xs text-blue-700 mt-2">
              这些设置可以在项目编辑器中随时修改
            </p>
          </div>

          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 btn-secondary"
              disabled={isLoading}
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? '创建中...' : '创建项目'}
            </button>
          </div>
        </form>
      </div>

      {/* 创建提示 */}
      <div className="mt-8 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">接下来您可以：</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-semibold">1</span>
            </div>
            <span>上传图层素材</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 font-semibold">2</span>
            </div>
            <span>设置稀有度权重</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 font-semibold">3</span>
            </div>
            <span>预览并生成NFT</span>
          </div>
        </div>
      </div>
    </div>
  )
} 