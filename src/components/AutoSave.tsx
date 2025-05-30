import { useEffect, useState } from 'react'
import { useProjectStore } from '../stores/projectStore'
import { Save, Clock, CheckCircle, AlertCircle, Download, Upload } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

interface AutoSaveProps {
  projectId?: string
  className?: string
}

export default function AutoSave({ projectId, className = '' }: AutoSaveProps) {
  const { 
    autoSave, 
    setAutoSaving, 
    markSaved, 
    setAutoSaveInterval,
    exportProject,
    importProject
  } = useProjectStore()
  
  const [timeUntilSave, setTimeUntilSave] = useState(autoSave.autoSaveInterval)
  const [showSettings, setShowSettings] = useState(false)
  const [customInterval, setCustomInterval] = useState(autoSave.autoSaveInterval)

  // 自动保存定时器
  useEffect(() => {
    if (!autoSave.hasUnsavedChanges) {
      setTimeUntilSave(autoSave.autoSaveInterval)
      return
    }

    const interval = setInterval(() => {
      setTimeUntilSave(prev => {
        if (prev <= 1) {
          // 触发自动保存
          handleAutoSave()
          return autoSave.autoSaveInterval
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [autoSave.hasUnsavedChanges, autoSave.autoSaveInterval])

  // 处理自动保存
  const handleAutoSave = async () => {
    if (autoSave.isAutoSaving) return

    setAutoSaving(true)
    
    try {
      // 模拟保存延迟（实际项目中这里会是真正的保存逻辑）
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      markSaved()
      toast.success('自动保存完成', {
        duration: 2000,
        icon: '✅'
      })
    } catch (error) {
      console.error('自动保存失败:', error)
      toast.error('自动保存失败')
      setAutoSaving(false)
    }
  }

  // 手动保存
  const handleManualSave = () => {
    if (!autoSave.hasUnsavedChanges) {
      toast('没有需要保存的更改', { icon: 'ℹ️' })
      return
    }
    handleAutoSave()
  }

  // 导出项目
  const handleExport = () => {
    if (!projectId) {
      toast.error('请先选择项目')
      return
    }

    try {
      const exportData = exportProject(projectId)
      const blob = new Blob([exportData], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `project_${projectId}_${new Date().toISOString().split('T')[0]}.json`
      link.click()
      URL.revokeObjectURL(url)
      
      toast.success('项目导出成功')
    } catch (error) {
      toast.error('项目导出失败')
    }
  }

  // 导入项目
  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = e.target?.result as string
          const newProject = importProject(data)
          toast.success(`项目 "${newProject.name}" 导入成功`)
        } catch (error) {
          toast.error('项目导入失败，请检查文件格式')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  // 更新自动保存间隔
  const updateInterval = () => {
    setAutoSaveInterval(customInterval)
    setShowSettings(false)
    toast.success(`自动保存间隔已设置为 ${customInterval} 秒`)
  }

  // 格式化时间显示
  const formatTime = (seconds: number) => {
    if (seconds >= 60) {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    }
    return `${seconds}s`
  }

  // 获取状态图标和颜色
  const getStatusIcon = () => {
    if (autoSave.isAutoSaving) {
      return <Clock className="h-4 w-4 animate-spin text-blue-500" />
    }
    if (autoSave.hasUnsavedChanges) {
      return <AlertCircle className="h-4 w-4 text-amber-500" />
    }
    return <CheckCircle className="h-4 w-4 text-green-500" />
  }

  const getStatusText = () => {
    if (autoSave.isAutoSaving) return '正在保存...'
    if (autoSave.hasUnsavedChanges) return `${formatTime(timeUntilSave)} 后自动保存`
    return autoSave.lastSavedAt 
      ? `已保存 (${new Date(autoSave.lastSavedAt).toLocaleTimeString()})`
      : '已保存'
  }

  const getStatusColor = () => {
    if (autoSave.isAutoSaving) return 'bg-blue-50 border-blue-200'
    if (autoSave.hasUnsavedChanges) return 'bg-amber-50 border-amber-200'
    return 'bg-green-50 border-green-200'
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* 保存状态显示 */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${getStatusColor()} transition-all duration-300`}
      >
        {getStatusIcon()}
        <span className="text-sm font-medium text-gray-700">
          {getStatusText()}
        </span>
      </motion.div>

      {/* 操作按钮 */}
      <div className="flex items-center space-x-2">
        {/* 手动保存按钮 */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleManualSave}
          disabled={autoSave.isAutoSaving || !autoSave.hasUnsavedChanges}
          className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 
                   disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="立即保存"
        >
          <Save className="h-4 w-4" />
        </motion.button>

        {/* 导出按钮 */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleExport}
          disabled={!projectId}
          className="p-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-600 
                   disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="导出项目"
        >
          <Download className="h-4 w-4" />
        </motion.button>

        {/* 导入按钮 */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleImport}
          className="p-2 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-600 transition-colors"
          title="导入项目"
        >
          <Upload className="h-4 w-4" />
        </motion.button>

        {/* 设置按钮 */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
          title="自动保存设置"
        >
          <Clock className="h-4 w-4" />
        </motion.button>
      </div>

      {/* 设置面板 */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50 min-w-64"
          >
            <h4 className="font-medium text-gray-900 mb-3">自动保存设置</h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  自动保存间隔 (秒)
                </label>
                <input
                  type="number"
                  value={customInterval}
                  onChange={(e) => setCustomInterval(Number(e.target.value))}
                  min="10"
                  max="300"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={updateInterval}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  应用
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// 快速预设间隔选项
export const AutoSavePresets = () => {
  const { setAutoSaveInterval } = useProjectStore()
  
  const presets = [
    { label: '10秒', value: 10 },
    { label: '30秒', value: 30 },
    { label: '1分钟', value: 60 },
    { label: '2分钟', value: 120 },
    { label: '5分钟', value: 300 }
  ]

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">快速设置:</span>
      {presets.map(preset => (
        <button
          key={preset.value}
          onClick={() => {
            setAutoSaveInterval(preset.value)
            toast.success(`自动保存间隔已设置为 ${preset.label}`)
          }}
          className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
        >
          {preset.label}
        </button>
      ))}
    </div>
  )
} 