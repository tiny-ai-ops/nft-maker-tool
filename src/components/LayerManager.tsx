import React, { useState, useRef } from 'react'
import { useProjectStore } from '../stores/projectStore'
import { Upload, Eye, EyeOff, GripVertical, X, Plus, ChevronUp, ChevronDown } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface LayerManagerProps {
  projectId: string
}

export default function LayerManager({ projectId }: LayerManagerProps) {
  const { 
    projects, 
    addLayer, 
    updateLayer, 
    deleteLayer, 
    moveLayerUp, 
    moveLayerDown, 
    reorderLayers,
    addTrait, 
    deleteTrait 
  } = useProjectStore()
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [draggedOverItem, setDraggedOverItem] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null)

  const project = projects.find(p => p.id === projectId)
  if (!project) return null

  // 按order排序图层
  const sortedLayers = [...project.layers].sort((a, b) => a.order - b.order)

  const handleFileUpload = (layerId: string, files: FileList) => {
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} 不是有效的图片文件`)
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        addTrait(projectId, layerId, {
          name: file.name.split('.')[0],
          fileName: file.name,
          fileData: result,
          rarity: 10, // 默认稀有度10%
          weight: 1
        })
        toast.success(`已添加素材: ${file.name}`)
      }
      reader.readAsDataURL(file)
    })
  }

  const handleDrop = (e: React.DragEvent, layerId: string) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(layerId, files)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const toggleLayerVisibility = (layerId: string) => {
    const layer = project.layers.find(l => l.id === layerId)
    if (layer) {
      updateLayer(projectId, layerId, { isVisible: !layer.isVisible })
    }
  }

  const createNewLayer = () => {
    const layerName = prompt('请输入图层名称:')
    if (layerName?.trim()) {
      addLayer(projectId, layerName.trim())
      toast.success('图层创建成功')
    }
  }

  // 处理图层拖拽开始
  const handleLayerDragStart = (e: React.DragEvent, layerId: string) => {
    setDraggedItem(layerId)
    e.dataTransfer.effectAllowed = 'move'
  }

  // 处理图层拖拽结束
  const handleLayerDragEnd = () => {
    setDraggedItem(null)
    setDraggedOverItem(null)
  }

  // 处理图层拖拽悬停
  const handleLayerDragOver = (e: React.DragEvent, layerId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDraggedOverItem(layerId)
  }

  // 处理图层拖拽放置
  const handleLayerDrop = (e: React.DragEvent, targetLayerId: string) => {
    e.preventDefault()
    
    if (!draggedItem || draggedItem === targetLayerId) return

    const draggedIndex = sortedLayers.findIndex(l => l.id === draggedItem)
    const targetIndex = sortedLayers.findIndex(l => l.id === targetLayerId)

    if (draggedIndex === -1 || targetIndex === -1) return

    // 重新排列图层
    const newLayers = [...sortedLayers]
    const [removed] = newLayers.splice(draggedIndex, 1)
    newLayers.splice(targetIndex, 0, removed)

    // 更新order
    const newLayerIds = newLayers.map(layer => layer.id)
    reorderLayers(projectId, newLayerIds)
    
    toast.success('图层顺序已更新')
    setDraggedItem(null)
    setDraggedOverItem(null)
  }

  return (
    <div className="card h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">图层管理</h3>
        <button
          onClick={createNewLayer}
          className="btn-primary text-sm flex items-center space-x-1"
        >
          <Plus className="h-4 w-4" />
          <span>新建图层</span>
        </button>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {project.layers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>还没有图层</p>
            <p className="text-sm">点击"新建图层"开始创建</p>
          </div>
        ) : (
          sortedLayers.map((layer, index) => (
            <div 
              key={layer.id} 
              className={`layer-item ${
                draggedItem === layer.id ? 'opacity-50' : ''
              } ${
                draggedOverItem === layer.id ? 'border-blue-400 bg-blue-50' : ''
              }`}
              draggable
              onDragStart={(e) => handleLayerDragStart(e, layer.id)}
              onDragEnd={handleLayerDragEnd}
              onDragOver={(e) => handleLayerDragOver(e, layer.id)}
              onDrop={(e) => handleLayerDrop(e, layer.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
                  <span className="font-medium">{layer.name}</span>
                  <span className="text-sm text-gray-500">
                    ({layer.traits.length} 个素材)
                  </span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    #{index + 1}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  {/* 图层顺序控制按钮 */}
                  <button
                    onClick={() => moveLayerUp(projectId, layer.id)}
                    disabled={index === 0}
                    className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                    title="上移图层"
                  >
                    <ChevronUp className="h-4 w-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => moveLayerDown(projectId, layer.id)}
                    disabled={index === sortedLayers.length - 1}
                    className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                    title="下移图层"
                  >
                    <ChevronDown className="h-4 w-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => toggleLayerVisibility(layer.id)}
                    className="p-1 hover:bg-gray-100 rounded"
                    title={layer.isVisible ? "隐藏图层" : "显示图层"}
                  >
                    {layer.isVisible ? (
                      <Eye className="h-4 w-4 text-blue-500" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={() => deleteLayer(projectId, layer.id)}
                    className="p-1 hover:bg-red-50 rounded text-red-500"
                    title="删除图层"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* 文件上传区域 */}
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors cursor-pointer"
                onDrop={(e) => handleDrop(e, layer.id)}
                onDragOver={handleDragOver}
                onClick={() => {
                  setSelectedLayer(layer.id)
                  fileInputRef.current?.click()
                }}
              >
                <Upload className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">拖拽图片到此处或点击上传</p>
                <p className="text-xs text-gray-500 mt-1">支持 PNG, JPG, GIF 格式</p>
              </div>

              {/* 素材列表 */}
              {layer.traits.length > 0 && (
                <div className="mt-3">
                  <div className="grid grid-cols-2 gap-2">
                    {layer.traits.map((trait) => (
                      <div key={trait.id} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={trait.fileData}
                            alt={trait.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity rounded-lg flex items-center justify-center">
                          <button
                            onClick={() => deleteTrait(projectId, layer.id, trait.id)}
                            className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-1 rounded-full transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="text-xs text-center mt-1 truncate">{trait.name}</p>
                        <p className="text-xs text-center text-gray-500">{trait.rarity}%</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && selectedLayer) {
            handleFileUpload(selectedLayer, e.target.files)
          }
        }}
      />
    </div>
  )
} 