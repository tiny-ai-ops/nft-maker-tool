import { Link } from 'react-router-dom'
import { useProjectStore } from '../stores/projectStore'
import { Plus, Calendar, Edit3, Trash2, Image } from 'lucide-react'
import { toast } from 'react-hot-toast'

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">我的NFT项目</h1>
        <p className="text-gray-600">管理您的NFT制作项目，创建独特的数字藏品</p>
      </div>

      {/* 项目网格 */}
      {projects.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Image className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">还没有项目</h3>
          <p className="text-gray-600 mb-6">创建您的第一个NFT项目开始制作数字藏品</p>
          <Link
            to="/create"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>新建项目</span>
          </Link>
        </div>
      ) : (
        <>
          {/* 新建项目卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            <Link
              to="/create"
              className="card hover:shadow-lg transition-shadow duration-200 border-2 border-dashed border-gray-300 hover:border-blue-400 group"
            >
              <div className="text-center py-8">
                <div className="mx-auto h-12 w-12 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center mb-4 transition-colors duration-200">
                  <Plus className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">新建项目</h3>
                <p className="text-sm text-gray-600">开始创建新的NFT项目</p>
              </div>
            </Link>

            {/* 现有项目卡片 */}
            {projects.map((project) => (
              <div key={project.id} className="card hover:shadow-lg transition-shadow duration-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* 项目统计 */}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>图层数量</span>
                    <span className="font-medium">{project.layers.length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>目标数量</span>
                    <span className="font-medium">{project.settings.totalSupply.toLocaleString()}</span>
                  </div>

                  {/* 更新时间 */}
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>更新于 {formatDate(project.updatedAt)}</span>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex space-x-2 pt-2">
                    <Link
                      to={`/project/${project.id}`}
                      className="flex-1 btn-primary text-center text-sm flex items-center justify-center space-x-1"
                    >
                      <Edit3 className="h-4 w-4" />
                      <span>编辑</span>
                    </Link>
                    
                    <button
                      onClick={() => handleDeleteProject(project.id, project.name)}
                      className="px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 统计信息 */}
      {projects.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">项目统计</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {projects.length}
              </div>
              <div className="text-sm text-gray-600">总项目数</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {projects.reduce((sum, p) => sum + p.layers.length, 0)}
              </div>
              <div className="text-sm text-gray-600">总图层数</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {projects.reduce((sum, p) => sum + p.settings.totalSupply, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">计划生成数量</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 