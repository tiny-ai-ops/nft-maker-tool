import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useProjectStore } from '../stores/projectStore'
import { ArrowLeft } from 'lucide-react'
import LayerManager from '../components/LayerManager'
import NFTPreview from '../components/NFTPreview'
import BatchGenerator from '../components/BatchGenerator'
import RarityEditor from '../components/RarityEditor'

export default function ProjectEditor() {
  const { id } = useParams<{ id: string }>()
  const { projects } = useProjectStore()

  if (!id) {
    return <div>项目ID无效</div>
  }

  const project = projects.find(p => p.id === id)

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">项目未找到</h2>
          <Link to="/dashboard" className="btn-primary">
            返回仪表板
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部导航 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link 
                to="/dashboard" 
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                返回
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
                {project.description && (
                  <p className="text-gray-600">{project.description}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>画布尺寸: {project.settings.width}×{project.settings.height}</span>
              <span>图层数: {project.layers.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-6">
          {/* 图层管理 */}
          <div className="space-y-6">
            <LayerManager projectId={id} />
          </div>

          {/* 稀有度设置 */}
          <div className="space-y-6">
            <RarityEditor projectId={id} />
          </div>

          {/* 预览 */}
          <div className="space-y-6">
            <NFTPreview projectId={id} />
          </div>

          {/* 批量生成 */}
          <div className="space-y-6">
            <BatchGenerator projectId={id} />
          </div>
        </div>
      </div>
    </div>
  )
} 