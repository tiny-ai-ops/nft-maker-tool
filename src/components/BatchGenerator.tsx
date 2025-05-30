import React, { useState } from 'react'
import { useProjectStore } from '../stores/projectStore'
import { Download, Package, Settings, FileText, Loader2, Image as ImageIcon } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { NFTMetadata, GeneratedNFT } from '../types'
import JSZip from 'jszip'
import { motion } from 'framer-motion'

interface BatchGeneratorProps {
  projectId: string
}

// 预设尺寸选项
const PRESET_SIZES = [
  { label: '512x512', width: 512, height: 512 },
  { label: '1024x1024', width: 1024, height: 1024 },
  { label: '2048x2048', width: 2048, height: 2048 },
  { label: '3000x3000', width: 3000, height: 3000 },
  { label: '4000x4000', width: 4000, height: 4000 }
]

export default function BatchGenerator({ projectId }: BatchGeneratorProps) {
  const { projects, updateProject } = useProjectStore()
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedNFTs, setGeneratedNFTs] = useState<GeneratedNFT[]>([])
  const [batchSize, setBatchSize] = useState(100)
  const [collectionName, setCollectionName] = useState('')
  const [collectionDescription, setCollectionDescription] = useState('')
  const [baseTokenURI, setBaseTokenURI] = useState('https://your-domain.com/metadata/')
  const [progress, setProgress] = useState(0)
  
  // 新增状态
  const [selectedPresetSize, setSelectedPresetSize] = useState('')
  const [customWidth, setCustomWidth] = useState(1000)
  const [customHeight, setCustomHeight] = useState(1000)
  const [imageQuality, setImageQuality] = useState(90)
  const [compressionLevel, setCompressionLevel] = useState(6)
  const [imageFormat, setImageFormat] = useState<'png' | 'jpg'>('png')

  const project = projects.find(p => p.id === projectId)
  if (!project) return null

  // 更新项目设置
  const updateProjectSettings = () => {
    if (!project) return

    const width = selectedPresetSize ? 
      PRESET_SIZES.find(size => size.label === selectedPresetSize)?.width || customWidth :
      customWidth

    const height = selectedPresetSize ?
      PRESET_SIZES.find(size => size.label === selectedPresetSize)?.height || customHeight :
      customHeight

    updateProject(projectId, {
      ...project,
      settings: {
        ...project.settings,
        width,
        height,
        quality: imageQuality,
        compressionLevel,
        format: imageFormat,
        presetSizes: !!selectedPresetSize,
        customSize: !selectedPresetSize
      }
    })
  }

  // 生成单个NFT
  const generateSingleNFT = async (tokenId: number): Promise<GeneratedNFT | null> => {
    try {
      // 创建canvas
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return null

      // 使用当前设置的尺寸
      const width = selectedPresetSize ? 
        PRESET_SIZES.find(size => size.label === selectedPresetSize)?.width || customWidth :
        customWidth

      const height = selectedPresetSize ?
        PRESET_SIZES.find(size => size.label === selectedPresetSize)?.height || customHeight :
        customHeight

      canvas.width = width
      canvas.height = height

      // 清空画布
      ctx.fillStyle = project.settings.backgroundColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const selectedTraits: { [layerName: string]: string } = {}
      const attributes: { trait_type: string; value: string; rarity?: number }[] = []

      // 按顺序渲染图层
      const visibleLayers = project.layers
        .filter(layer => layer.isVisible && layer.traits.length > 0)
        .sort((a, b) => a.order - b.order)

      for (const layer of visibleLayers) {
        // 基于稀有度权重随机选择特征
        const totalWeight = layer.traits.reduce((sum, trait) => sum + trait.weight, 0)
        let random = Math.random() * totalWeight
        
        let selectedTrait = null
        for (const trait of layer.traits) {
          random -= trait.weight
          if (random <= 0) {
            selectedTrait = trait
            break
          }
        }

        if (selectedTrait) {
          selectedTraits[layer.name] = selectedTrait.name
          attributes.push({
            trait_type: layer.name,
            value: selectedTrait.name,
            rarity: selectedTrait.rarity
          })

          // 绘制图片
          await new Promise<void>((resolve, reject) => {
            const img = new Image()
            img.onload = () => {
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
              resolve()
            }
            img.onerror = reject
            img.src = selectedTrait.fileData
          })
        }
      }

      // 根据格式和质量设置导出图片
      let imageData: string
      if (imageFormat === 'jpg') {
        imageData = canvas.toDataURL('image/jpeg', imageQuality / 100)
      } else {
        // PNG格式不支持质量设置，但可以通过压缩级别控制文件大小
        imageData = canvas.toDataURL('image/png')
      }

      // 生成metadata
      const metadata: NFTMetadata = {
        name: `${collectionName || project.name} #${tokenId}`,
        description: collectionDescription || project.description || `Generated NFT from ${project.name}`,
        image: `${baseTokenURI}${tokenId}.${imageFormat}`,
        attributes,
        properties: {
          size: {
            width,
            height
          },
          format: imageFormat,
          quality: imageFormat === 'jpg' ? imageQuality : undefined,
          compressionLevel: imageFormat === 'png' ? compressionLevel : undefined
        }
      }

      return {
        id: tokenId,
        imageData,
        metadata,
        traits: selectedTraits
      }
    } catch (error) {
      console.error('生成NFT失败:', error)
      return null
    }
  }

  // 批量生成NFT
  const generateBatch = async () => {
    if (!project.layers.some(layer => layer.isVisible && layer.traits.length > 0)) {
      toast.error('请先添加图层和素材')
      return
    }

    setIsGenerating(true)
    setProgress(0)
    const generated: GeneratedNFT[] = []

    try {
      for (let i = 1; i <= batchSize; i++) {
        const nft = await generateSingleNFT(i)
        if (nft) {
          generated.push(nft)
        }
        
        // 更新进度
        const newProgress = Math.floor((i / batchSize) * 100)
        setProgress(newProgress)
      }

      setGeneratedNFTs(generated)
      toast.success(`批量生成完成！共生成 ${generated.length} 个NFT`)
    } catch (error) {
      console.error('批量生成失败:', error)
      toast.error('批量生成失败')
    } finally {
      setIsGenerating(false)
      setProgress(0)
    }
  }

  // 下载ZIP压缩包
  const downloadAsZip = async (type: 'images' | 'metadata' | 'all') => {
    if (generatedNFTs.length === 0) {
      toast.error('请先生成NFT')
      return
    }

    const zip = new JSZip()
    
    if (type === 'images' || type === 'all') {
      const imagesFolder = zip.folder('images')
      generatedNFTs.forEach((nft) => {
        const imageData = nft.imageData.split(',')[1] // 移除 data:image/png;base64,
        imagesFolder?.file(`${nft.id}.png`, imageData, { base64: true })
      })
    }

    if (type === 'metadata' || type === 'all') {
      const metadataFolder = zip.folder('metadata')
      generatedNFTs.forEach((nft) => {
        metadataFolder?.file(
          `${nft.id}.json`,
          JSON.stringify(nft.metadata, null, 2)
        )
      })
    }

    const content = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(content)
    const link = document.createElement('a')
    link.href = url
    link.download = `${project.name}-${type}.zip`
    link.click()
    URL.revokeObjectURL(url)
    
    toast.success('下载开始')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 space-y-6"
    >
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">批量生成</h2>
        
        {/* 图片设置部分 */}
        <div className="space-y-4 border-b border-gray-200 pb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <ImageIcon className="w-5 h-5 mr-2" />
            图片设置
          </h3>
          
          {/* 尺寸设置 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                预设尺寸
              </label>
              <select
                value={selectedPresetSize}
                onChange={(e) => {
                  setSelectedPresetSize(e.target.value)
                  if (e.target.value) {
                    const size = PRESET_SIZES.find(s => s.label === e.target.value)
                    if (size) {
                      setCustomWidth(size.width)
                      setCustomHeight(size.height)
                    }
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">自定义尺寸</option>
                {PRESET_SIZES.map(size => (
                  <option key={size.label} value={size.label}>{size.label}</option>
                ))}
              </select>
            </div>

            {!selectedPresetSize && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    自定义宽度 (px)
                  </label>
                  <input
                    type="number"
                    value={customWidth}
                    onChange={(e) => setCustomWidth(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    max="10000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    自定义高度 (px)
                  </label>
                  <input
                    type="number"
                    value={customHeight}
                    onChange={(e) => setCustomHeight(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    max="10000"
                  />
                </div>
              </>
            )}
          </div>

          {/* 图片质量设置 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                图片格式
              </label>
              <select
                value={imageFormat}
                onChange={(e) => setImageFormat(e.target.value as 'png' | 'jpg')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="png">PNG (无损)</option>
                <option value="jpg">JPG (有损)</option>
              </select>
            </div>

            {imageFormat === 'jpg' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  JPG质量 (1-100)
                </label>
                <input
                  type="number"
                  value={imageQuality}
                  onChange={(e) => setImageQuality(Math.max(1, Math.min(100, parseInt(e.target.value) || 90)))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                  max="100"
                />
              </div>
            )}

            {imageFormat === 'png' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PNG压缩级别 (0-9)
                </label>
                <input
                  type="number"
                  value={compressionLevel}
                  onChange={(e) => setCompressionLevel(Math.max(0, Math.min(9, parseInt(e.target.value) || 6)))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  max="9"
                />
              </div>
            )}
          </div>
        </div>

        {/* 原有的设置表单 */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                系列名称
              </label>
              <input
                type="text"
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
                placeholder={project.name}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                系列描述
              </label>
              <textarea
                value={collectionDescription}
                onChange={(e) => setCollectionDescription(e.target.value)}
                placeholder={project.description}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Base Token URI
              </label>
              <input
                type="text"
                value={baseTokenURI}
                onChange={(e) => setBaseTokenURI(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                生成数量
              </label>
              <input
                type="number"
                value={batchSize}
                onChange={(e) => setBatchSize(parseInt(e.target.value))}
                min="1"
                max="10000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="space-y-4">
          <button
            onClick={() => {
              updateProjectSettings()
              generateBatch()
            }}
            disabled={isGenerating}
            className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Package className="w-5 h-5 mr-2" />
                开始生成
              </>
            )}
          </button>

          {/* 进度条 */}
          {isGenerating && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <motion.div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${progress}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* 下载按钮 */}
          {generatedNFTs.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => downloadAsZip('images')}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <Download className="w-5 h-5 mr-2" />
                下载图片(ZIP)
              </button>
              
              <button
                onClick={() => downloadAsZip('metadata')}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <FileText className="w-5 h-5 mr-2" />
                下载元数据(ZIP)
              </button>

              <button
                onClick={() => downloadAsZip('all')}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors sm:col-span-2"
              >
                <Package className="w-5 h-5 mr-2" />
                下载全部(ZIP)
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
} 