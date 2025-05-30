import { useParams, Link } from 'react-router-dom'
import { useProjectStore } from '../stores/projectStore'
import { ArrowLeft, Layers, Palette, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import LayerManager from '../components/LayerManager'
import NFTPreview from '../components/NFTPreview'
import BatchGenerator from '../components/BatchGenerator'
import RarityEditor from '../components/RarityEditor'
import AutoSave from '../components/AutoSave'
import NetworkStatus from '../components/NetworkStatus'

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
      {/* 导航栏 */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-40 mb-8"
      >
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* 左侧：返回按钮和项目信息 */}
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 
                         transition-colors bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="font-medium">返回仪表板</span>
              </Link>
              
              <div className="border-l border-gray-300 pl-4">
                <h1 className="text-xl font-bold text-gray-900">{project.name}</h1>
                <p className="text-sm text-gray-600">
                  {project.description || '暂无描述'}
                </p>
              </div>
            </div>

            {/* 右侧：网络状态和自动保存组件 */}
            <div className="flex items-center space-x-3">
              <NetworkStatus />
              <AutoSave projectId={id} />
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