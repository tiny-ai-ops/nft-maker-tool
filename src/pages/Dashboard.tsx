import { Link } from 'react-router-dom'
import { useProjectStore } from '../stores/projectStore'
import { Plus, Calendar, Edit3, Trash2, Image, Sparkles, TrendingUp } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function Dashboard() {
  const { projects, deleteProject } = useProjectStore()

  const handleDeleteProject = (projectId: string, projectName: string) => {
    if (window.confirm(`确定要删除项目"${projectName}"吗？此操作不可撤销。`)) {
      deleteProject(projectId)
      toast.success('项目已删除')
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 页面标题 */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center space-x-3 mb-6">
          <div className="h-16 w-16 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 
                        rounded-3xl flex items-center justify-center shadow-xl shadow-blue-500/25 floating-animation">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold gradient-text mb-4">我的NFT工作台</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          管理您的NFT制作项目，创建独特的数字藏品系列
        </p>
      </motion.div>

      {/* 项目网格 */}
      {projects.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="mx-auto h-32 w-32 bg-gradient-to-br from-blue-100 to-purple-100 
                        rounded-full flex items-center justify-center mb-8 relative">
            <Image className="h-16 w-16 text-gray-400" />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 
                          rounded-full blur-xl"></div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">开始您的NFT创作之旅</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            创建您的第一个NFT项目，开始制作独特的数字藏品系列
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/create"
              className="btn-primary inline-flex items-center space-x-3 text-lg px-8 py-4"
            >
              <Plus className="h-6 w-6" />
              <span>创建第一个项目</span>
            </Link>
          </motion.div>
        </motion.div>
      ) : (
        <>
          {/* 项目卡片网格 */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12"
          >
            {/* 新建项目卡片 */}
            <motion.div variants={itemVariants}>
              <Link
                to="/create"
                className="group h-full"
              >
                <div className="card h-full border-2 border-dashed border-gray-300/50 
                              hover:border-blue-400/50 group-hover:shadow-2xl 
                              group-hover:shadow-blue-500/20 transition-all duration-500
                              group-hover:scale-105 cursor-pointer">
                  <div className="text-center py-12">
                    <div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-100 to-purple-100 
                                  group-hover:from-blue-200 group-hover:to-purple-200 
                                  rounded-2xl flex items-center justify-center mb-6 
                                  transition-all duration-300 group-hover:scale-110">
                      <Plus className="h-8 w-8 text-blue-600 group-hover:text-blue-700" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">新建项目</h3>
                    <p className="text-gray-600">开始创建新的NFT项目</p>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* 现有项目卡片 */}
            {projects.map((project) => (
              <motion.div 
                key={project.id} 
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="group"
              >
                <div className="card h-full group-hover:shadow-2xl group-hover:shadow-gray-500/20 
                              transition-all duration-500">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 truncate group-hover:gradient-text transition-all duration-300">
                        {project.name}
                      </h3>
                      <p className="text-gray-600 line-clamp-2 text-sm leading-relaxed">
                        {project.description || '暂无描述'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* 项目统计 */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50/50 rounded-xl p-3 text-center">
                        <div className="text-lg font-bold text-blue-600 mb-1">{project.layers.length}</div>
                        <div className="text-xs text-gray-600">图层</div>
                      </div>
                      <div className="bg-purple-50/50 rounded-xl p-3 text-center">
                        <div className="text-lg font-bold text-purple-600 mb-1">
                          {project.settings.totalSupply.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-600">目标</div>
                      </div>
                    </div>

                    {/* 更新时间 */}
                    <div className="flex items-center text-xs text-gray-500 px-3 py-2 
                                  bg-gray-50/50 rounded-lg">
                      <Calendar className="h-3 w-3 mr-2" />
                      <span>更新于 {formatDate(project.updatedAt)}</span>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex space-x-3 pt-2">
                      <Link
                        to={`/project/${project.id}`}
                        className="flex-1 btn-primary text-center text-sm flex items-center justify-center space-x-2 py-3"
                      >
                        <Edit3 className="h-4 w-4" />
                        <span>编辑项目</span>
                      </Link>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteProject(project.id, project.name)}
                        className="px-4 py-3 text-red-500 hover:text-red-700 hover:bg-red-50 
                                 rounded-xl transition-all duration-200 border border-red-200/50
                                 hover:border-red-300 hover:shadow-lg hover:shadow-red-500/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </>
      )}

      {/* 统计信息 */}
      {projects.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center space-x-3 mb-8">
            <div className="h-10 w-10 bg-gradient-to-r from-green-500 to-emerald-600 
                          rounded-xl flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">项目统计</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100/50 
                          rounded-2xl p-6 border border-blue-200/50">
              <div className="text-3xl font-bold gradient-text mb-2">
                {projects.length}
              </div>
              <div className="text-gray-600 font-medium">总项目数</div>
            </div>
            
            <div className="text-center bg-gradient-to-br from-purple-50 to-purple-100/50 
                          rounded-2xl p-6 border border-purple-200/50">
              <div className="text-3xl font-bold gradient-text mb-2">
                {projects.reduce((sum, p) => sum + p.layers.length, 0)}
              </div>
              <div className="text-gray-600 font-medium">总图层数</div>
            </div>
            
            <div className="text-center bg-gradient-to-br from-green-50 to-green-100/50 
                          rounded-2xl p-6 border border-green-200/50">
              <div className="text-3xl font-bold gradient-text mb-2">
                {projects.reduce((sum, p) => sum + p.settings.totalSupply, 0).toLocaleString()}
              </div>
              <div className="text-gray-600 font-medium">计划生成数量</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
} 