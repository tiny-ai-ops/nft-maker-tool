import { useState } from 'react'
import { useProjectStore } from '../stores/projectStore'
import { Download, Package, Settings, FileText, Loader2, Image as ImageIcon, Sparkles } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { NFTMetadata, GeneratedNFT } from '../types'
import JSZip from 'jszip'
import { motion, AnimatePresence } from 'framer-motion'

interface BatchGeneratorProps {
  projectId: string
}

// 预设尺寸选项
const PRESET_SIZES = [
  { label: '512x512', width: 512, height: 512, popular: false },
  { label: '1024x1024', width: 1024, height: 1024, popular: true },
  { label: '2048x2048', width: 2048, height: 2048, popular: true },
  { label: '3000x3000', width: 3000, height: 3000, popular: false },
  { label: '4000x4000', width: 4000, height: 4000, popular: false }
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
        const imageData = nft.imageData.split(',')[1] // 移除 data:image/png;base64, 或 data:image/jpeg;base64,
        const extension = imageFormat === 'jpg' ? 'jpg' : 'png'
        imagesFolder?.file(`${nft.id}.${extension}`, imageData, { base64: true })
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
      className="card space-y-8"
    >
      {/* 标题区域 */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="h-12 w-12 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 
                        rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold gradient-text">批量生成</h2>
        </div>
        <p className="text-gray-600">配置参数，一键生成整个NFT系列</p>
      </div>
      
      {/* 图片设置部分 */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-6"
      >
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 
                        rounded-lg flex items-center justify-center">
            <ImageIcon className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">图片设置</h3>
        </div>
        
        {/* 尺寸设置 */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            选择尺寸
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {PRESET_SIZES.map(size => (
              <motion.button
                key={size.label}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedPresetSize(size.label)
                  setCustomWidth(size.width)
                  setCustomHeight(size.height)
                }}
                className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                  selectedPresetSize === size.label
                    ? 'border-blue-500 bg-blue-50/50 shadow-lg shadow-blue-500/20'
                    : 'border-gray-200 bg-white/50 hover:border-gray-300 hover:bg-white/80'
                }`}
              >
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{size.label}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {size.width} × {size.height}
                  </div>
                </div>
                {size.popular && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-400 to-pink-500 
                                text-white text-xs px-2 py-1 rounded-full font-semibold">
                    推荐
                  </div>
                )}
                {selectedPresetSize === size.label && (
                  <motion.div
                    layoutId="selectedSize"
                    className="absolute inset-0 border-2 border-blue-500 rounded-xl bg-blue-500/10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            ))}
            
            {/* 自定义选项 */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedPresetSize('')}
              className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                !selectedPresetSize
                  ? 'border-purple-500 bg-purple-50/50 shadow-lg shadow-purple-500/20'
                  : 'border-gray-200 bg-white/50 hover:border-gray-300 hover:bg-white/80'
              }`}
            >
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">自定义</div>
                <div className="text-xs text-gray-500 mt-1">自由设置</div>
              </div>
              {!selectedPresetSize && (
                <motion.div
                  layoutId="selectedSize"
                  className="absolute inset-0 border-2 border-purple-500 rounded-xl bg-purple-500/10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          </div>

          {/* 自定义尺寸输入 */}
          <AnimatePresence>
            {!selectedPresetSize && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    宽度 (px)
                  </label>
                  <input
                    type="number"
                    value={customWidth}
                    onChange={(e) => setCustomWidth(Math.max(1, parseInt(e.target.value) || 0))}
                    className="input-field"
                    min="1"
                    max="10000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    高度 (px)
                  </label>
                  <input
                    type="number"
                    value={customHeight}
                    onChange={(e) => setCustomHeight(Math.max(1, parseInt(e.target.value) || 0))}
                    className="input-field"
                    min="1"
                    max="10000"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 图片质量设置 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              图片格式
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'png', label: 'PNG', desc: '无损压缩' },
                { value: 'jpg', label: 'JPG', desc: '有损压缩' }
              ].map((format) => (
                <motion.button
                  key={format.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setImageFormat(format.value as 'png' | 'jpg')}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 text-center ${
                    imageFormat === format.value
                      ? 'border-blue-500 bg-blue-50/50 shadow-lg shadow-blue-500/20'
                      : 'border-gray-200 bg-white/50 hover:border-gray-300 hover:bg-white/80'
                  }`}
                >
                  <div className="font-bold text-gray-900">{format.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{format.desc}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* 质量设置 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              {imageFormat === 'jpg' ? 'JPG质量' : 'PNG压缩级别'}
            </label>
            <div className="space-y-3">
              <input
                type="range"
                value={imageFormat === 'jpg' ? imageQuality : compressionLevel}
                onChange={(e) => {
                  if (imageFormat === 'jpg') {
                    setImageQuality(parseInt(e.target.value))
                  } else {
                    setCompressionLevel(parseInt(e.target.value))
                  }
                }}
                min={imageFormat === 'jpg' ? 1 : 0}
                max={imageFormat === 'jpg' ? 100 : 9}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #8b5cf6 ${
                    imageFormat === 'jpg' ? imageQuality : (compressionLevel / 9) * 100
                  }%, #e5e7eb ${
                    imageFormat === 'jpg' ? imageQuality : (compressionLevel / 9) * 100
                  }%, #e5e7eb 100%)`
                }}
              />
              <div className="text-center">
                <span className="text-lg font-bold text-gray-900">
                  {imageFormat === 'jpg' ? imageQuality : compressionLevel}
                  {imageFormat === 'jpg' ? '%' : ''}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 系列设置 */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
          <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-600 
                        rounded-lg flex items-center justify-center">
            <Settings className="h-4 w-4 text-white" />
          </div>
          <span>系列设置</span>
        </h3>
        
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              系列名称
            </label>
            <input
              type="text"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              placeholder={project.name}
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              系列描述
            </label>
            <textarea
              value={collectionDescription}
              onChange={(e) => setCollectionDescription(e.target.value)}
              placeholder={project.description}
              className="input-field resize-none"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Base Token URI
            </label>
            <input
              type="text"
              value={baseTokenURI}
              onChange={(e) => setBaseTokenURI(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              生成数量
            </label>
            <input
              type="number"
              value={batchSize}
              onChange={(e) => setBatchSize(parseInt(e.target.value))}
              min="1"
              max="10000"
              className="input-field"
            />
          </div>
        </div>
      </motion.div>

      {/* 操作按钮 */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-6"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            updateProjectSettings()
            generateBatch()
          }}
          disabled={isGenerating}
          className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-6 h-6 mr-3 animate-spin" />
              生成中... ({progress}%)
            </>
          ) : (
            <>
              <Package className="w-6 h-6 mr-3" />
              开始生成 {batchSize} 个 NFT
            </>
          )}
        </motion.button>

        {/* 进度条 */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div 
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0, scaleX: 0 }}
              className="progress-bar"
            >
              <motion.div
                className="progress-fill"
                style={{ width: `${progress}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 下载按钮 */}
        <AnimatePresence>
          {generatedNFTs.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => downloadAsZip('images')}
                className="btn-secondary flex items-center justify-center"
              >
                <Download className="w-5 h-5 mr-2" />
                下载图片 ({generatedNFTs.length})
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => downloadAsZip('metadata')}
                className="btn-secondary flex items-center justify-center"
              >
                <FileText className="w-5 h-5 mr-2" />
                下载元数据
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => downloadAsZip('all')}
                className="btn-primary sm:col-span-2 flex items-center justify-center"
              >
                <Package className="w-5 h-5 mr-2" />
                下载完整套装
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
} 