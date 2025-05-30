import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useProjectStore } from '../stores/projectStore'
import { ArrowLeft, Layers, Palette, Eye, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
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
      <div className="min-h-screen hero-section flex items-center justify-center pt-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center card"
        >
          <h2 className="text-3xl font-bold gradient-text mb-6">项目未找到</h2>
          <p className="text-gray-600 mb-8">该项目可能已被删除或不存在</p>
          <Link to="/dashboard" className="btn-primary">
            返回仪表板
          </Link>
        </motion.div>
      </div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen hero-section pt-20">
      {/* 头部导航 */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="nav-glass border-b-0"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-6">
              <Link 
                to="/dashboard" 
                className="btn-secondary flex items-center space-x-2"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>返回</span>
              </Link>
              
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 
                              rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold gradient-text">{project.name}</h1>
                  {project.description && (
                    <p className="text-gray-600 mt-1">{project.description}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/50 backdrop-blur-sm 
                            rounded-xl border border-gray-200/50 shadow-lg shadow-gray-500/5">
                <Eye className="h-4 w-4 text-blue-600" />
                <span className="text-gray-700">
                  <span className="font-semibold">{project.settings.width}×{project.settings.height}</span>
                </span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/50 backdrop-blur-sm 
                            rounded-xl border border-gray-200/50 shadow-lg shadow-gray-500/5">
                <Layers className="h-4 w-4 text-purple-600" />
                <span className="text-gray-700">
                  <span className="font-semibold">{project.layers.length}</span> 图层
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 主要内容 */}
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-8"
        >
          {/* 图层管理 */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 
                            rounded-lg flex items-center justify-center">
                <Layers className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">图层管理</h2>
            </div>
            <LayerManager projectId={id} />
          </motion.div>

          {/* 稀有度设置 */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-600 
                            rounded-lg flex items-center justify-center">
                <Palette className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">稀有度设置</h2>
            </div>
            <RarityEditor projectId={id} />
          </motion.div>

          {/* 预览 */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-8 w-8 bg-gradient-to-r from-green-500 to-emerald-600 
                            rounded-lg flex items-center justify-center">
                <Eye className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">实时预览</h2>
            </div>
            <NFTPreview projectId={id} />
          </motion.div>

          {/* 批量生成 */}
          <motion.div variants={itemVariants} className="space-y-6">
            <BatchGenerator projectId={id} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
} 