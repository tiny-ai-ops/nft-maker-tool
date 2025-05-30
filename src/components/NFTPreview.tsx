import { useRef, useEffect, useState } from 'react'
import { useProjectStore } from '../stores/projectStore'
import { Shuffle, Download, RefreshCw, FileText } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { NFTMetadata } from '../types'

interface NFTPreviewProps {
  projectId: string
}

export default function NFTPreview({ projectId }: NFTPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { projects } = useProjectStore()
  const [currentTraits, setCurrentTraits] = useState<{[layerId: string]: string}>({})
  const [isGenerating, setIsGenerating] = useState(false)

  const project = projects.find(p => p.id === projectId)
  if (!project) return null

  // 随机选择每个图层的特征
  const generateRandomCombination = () => {
    const newTraits: {[layerId: string]: string} = {}
    
    project.layers.forEach(layer => {
      if (layer.isVisible && layer.traits.length > 0) {
        // 基于稀有度权重随机选择
        const totalWeight = layer.traits.reduce((sum, trait) => sum + trait.weight, 0)
        let random = Math.random() * totalWeight
        
        for (const trait of layer.traits) {
          random -= trait.weight
          if (random <= 0) {
            newTraits[layer.id] = trait.id
            break
          }
        }
      }
    })
    
    setCurrentTraits(newTraits)
  }

  // 渲染Canvas
  const renderCanvas = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    setIsGenerating(true)

    // 设置Canvas尺寸
    canvas.width = project.settings.width
    canvas.height = project.settings.height

    // 清空画布
    ctx.fillStyle = project.settings.backgroundColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 按顺序渲染图层
    const visibleLayers = project.layers
      .filter(layer => layer.isVisible)
      .sort((a, b) => a.order - b.order)

    for (const layer of visibleLayers) {
      const selectedTraitId = currentTraits[layer.id]
      if (!selectedTraitId) continue

      const trait = layer.traits.find(t => t.id === selectedTraitId)
      if (!trait) continue

      try {
        await new Promise<void>((resolve, reject) => {
          const img = new Image()
          img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
            resolve()
          }
          img.onerror = reject
          img.src = trait.fileData
        })
      } catch (error) {
        console.error('Failed to load image:', error)
        toast.error(`加载图片失败: ${trait.name}`)
      }
    }

    setIsGenerating(false)
  }

  // 下载预览图
  const downloadPreview = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = `${project.name}_preview_${Date.now()}.png`
    link.href = canvas.toDataURL()
    link.click()
    
    toast.success('预览图已下载')
  }

  // 下载当前组合的metadata
  const downloadCurrentMetadata = () => {
    if (Object.keys(currentTraits).length === 0) {
      toast.error('请先生成预览')
      return
    }

    // 构建attributes
    const attributes = project.layers
      .filter(layer => layer.isVisible && currentTraits[layer.id])
      .map(layer => {
        const trait = layer.traits.find(t => t.id === currentTraits[layer.id])
        return trait ? {
          trait_type: layer.name,
          value: trait.name,
          rarity: trait.rarity
        } : null
      })
      .filter(Boolean)

    const metadata: NFTMetadata = {
      name: `${project.name} Preview`,
      description: project.description || `Generated NFT from ${project.name}`,
      image: "preview.png",
      attributes: attributes as any[]
    }

    const blob = new Blob([JSON.stringify(metadata, null, 2)], {
      type: 'application/json'
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = `${project.name}_preview_metadata.json`
    link.href = url
    link.click()
    URL.revokeObjectURL(url)

    toast.success('Metadata已下载')
  }

  // 初始化时生成随机组合
  useEffect(() => {
    if (project.layers.some(layer => layer.traits.length > 0)) {
      generateRandomCombination()
    }
  }, [project.layers])

  // 当特征组合改变时重新渲染
  useEffect(() => {
    if (Object.keys(currentTraits).length > 0) {
      renderCanvas()
    }
  }, [currentTraits, project])

  const hasTraits = project.layers.some(layer => layer.traits.length > 0)

  return (
    <div className="card h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">预览</h3>
        <div className="flex space-x-2">
          <button
            onClick={generateRandomCombination}
            disabled={!hasTraits || isGenerating}
            className="btn-secondary text-sm flex items-center space-x-1 disabled:opacity-50"
          >
            <Shuffle className="h-4 w-4" />
            <span>随机组合</span>
          </button>
          <button
            onClick={downloadPreview}
            disabled={!hasTraits || isGenerating}
            className="btn-primary text-sm flex items-center space-x-1 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            <span>下载图片</span>
          </button>
          <button
            onClick={downloadCurrentMetadata}
            disabled={!hasTraits || isGenerating || Object.keys(currentTraits).length === 0}
            className="btn-secondary text-sm flex items-center space-x-1 disabled:opacity-50"
          >
            <FileText className="h-4 w-4" />
            <span>下载JSON</span>
          </button>
        </div>
      </div>

      <div className="relative">
        {!hasTraits ? (
          <div className="aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-500">
            <RefreshCw className="h-12 w-12 mb-4 text-gray-300" />
            <p className="text-center">还没有上传素材</p>
            <p className="text-sm text-center">请先在左侧上传图层素材</p>
          </div>
        ) : (
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="w-full aspect-square border border-gray-200 rounded-lg bg-white"
              style={{ 
                maxWidth: '100%',
                height: 'auto',
                imageRendering: 'pixelated'
              }}
            />
            {isGenerating && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
                <div className="flex items-center space-x-2 text-blue-600">
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>生成中...</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 当前组合信息 */}
      {hasTraits && Object.keys(currentTraits).length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">当前组合:</h4>
          <div className="space-y-1 text-xs text-gray-600 max-h-24 overflow-y-auto">
            {project.layers
              .filter(layer => layer.isVisible && currentTraits[layer.id])
              .map(layer => {
                const trait = layer.traits.find(t => t.id === currentTraits[layer.id])
                return trait ? (
                  <div key={layer.id} className="flex justify-between">
                    <span>{layer.name}:</span>
                    <span>{trait.name} ({trait.rarity}%)</span>
                  </div>
                ) : null
              })}
          </div>
        </div>
      )}

      {/* 统计信息 */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center">
            <div className="font-semibold text-blue-600">
              {project.layers.filter(l => l.isVisible).length}
            </div>
            <div className="text-gray-600">可见图层</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-purple-600">
              {project.layers.reduce((sum, l) => sum + l.traits.length, 0)}
            </div>
            <div className="text-gray-600">总素材数</div>
          </div>
        </div>
      </div>
    </div>
  )
} 