import React, { useState } from 'react'
import { useProjectStore } from '../stores/projectStore'
import { Download, Package, Settings, FileText } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { NFTMetadata, GeneratedNFT } from '../types'

interface BatchGeneratorProps {
  projectId: string
}

export default function BatchGenerator({ projectId }: BatchGeneratorProps) {
  const { projects } = useProjectStore()
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedNFTs, setGeneratedNFTs] = useState<GeneratedNFT[]>([])
  const [batchSize, setBatchSize] = useState(100)
  const [collectionName, setCollectionName] = useState('')
  const [collectionDescription, setCollectionDescription] = useState('')
  const [baseTokenURI, setBaseTokenURI] = useState('https://your-domain.com/metadata/')

  const project = projects.find(p => p.id === projectId)
  if (!project) return null

  // 生成单个NFT
  const generateSingleNFT = async (tokenId: number): Promise<GeneratedNFT | null> => {
    try {
      // 创建canvas
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return null

      canvas.width = project.settings.width
      canvas.height = project.settings.height

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

      // 生成metadata
      const metadata: NFTMetadata = {
        name: `${collectionName || project.name} #${tokenId}`,
        description: collectionDescription || project.description || `Generated NFT from ${project.name}`,
        image: `${baseTokenURI}${tokenId}.png`,
        attributes
      }

      return {
        id: tokenId,
        imageData: canvas.toDataURL('image/png'),
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
    const generated: GeneratedNFT[] = []

    try {
      for (let i = 1; i <= batchSize; i++) {
        const nft = await generateSingleNFT(i)
        if (nft) {
          generated.push(nft)
        }
        
        // 更新进度
        if (i % 10 === 0) {
          toast.success(`已生成 ${i}/${batchSize} 个NFT`)
        }
      }

      setGeneratedNFTs(generated)
      toast.success(`批量生成完成！共生成 ${generated.length} 个NFT`)
    } catch (error) {
      console.error('批量生成失败:', error)
      toast.error('批量生成失败')
    } finally {
      setIsGenerating(false)
    }
  }

  // 下载所有图片
  const downloadImages = () => {
    if (generatedNFTs.length === 0) {
      toast.error('请先生成NFT')
      return
    }

    generatedNFTs.forEach((nft) => {
      const link = document.createElement('a')
      link.download = `${nft.id}.png`
      link.href = nft.imageData
      link.click()
    })

    toast.success('图片下载开始')
  }

  // 下载metadata文件
  const downloadMetadata = () => {
    if (generatedNFTs.length === 0) {
      toast.error('请先生成NFT')
      return
    }

    // 下载单个metadata文件
    generatedNFTs.forEach((nft) => {
      const blob = new Blob([JSON.stringify(nft.metadata, null, 2)], {
        type: 'application/json'
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.download = `${nft.id}.json`
      link.href = url
      link.click()
      URL.revokeObjectURL(url)
    })

    toast.success('Metadata文件下载开始')
  }

  // 下载汇总报告
  const downloadReport = () => {
    if (generatedNFTs.length === 0) {
      toast.error('请先生成NFT')
      return
    }

    // 统计特征分布
    const traitStats: { [key: string]: { [value: string]: number } } = {}
    
    generatedNFTs.forEach(nft => {
      nft.metadata.attributes.forEach(attr => {
        if (!traitStats[attr.trait_type]) {
          traitStats[attr.trait_type] = {}
        }
        if (!traitStats[attr.trait_type][attr.value]) {
          traitStats[attr.trait_type][attr.value] = 0
        }
        traitStats[attr.trait_type][attr.value]++
      })
    })

    const report = {
      collection: {
        name: collectionName || project.name,
        description: collectionDescription || project.description,
        totalSupply: generatedNFTs.length,
        generatedAt: new Date().toISOString()
      },
      traitDistribution: traitStats,
      nfts: generatedNFTs.map(nft => ({
        id: nft.id,
        traits: nft.traits,
        attributes: nft.metadata.attributes
      }))
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: 'application/json'
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = `${project.name}_generation_report.json`
    link.href = url
    link.click()
    URL.revokeObjectURL(url)

    toast.success('生成报告已下载')
  }

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-4">
        <Package className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">批量生成</h3>
      </div>

      {/* 配置区域 */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              生成数量
            </label>
            <input
              type="number"
              value={batchSize}
              onChange={(e) => setBatchSize(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              max="10000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              集合名称
            </label>
            <input
              type="text"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              placeholder={project.name}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            集合描述
          </label>
          <textarea
            value={collectionDescription}
            onChange={(e) => setCollectionDescription(e.target.value)}
            placeholder={project.description || "输入集合描述..."}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            基础Token URI
          </label>
          <input
            type="text"
            value={baseTokenURI}
            onChange={(e) => setBaseTokenURI(e.target.value)}
            placeholder="https://your-domain.com/metadata/"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="space-y-3">
        <button
          onClick={generateBatch}
          disabled={isGenerating}
          className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <Package className="h-4 w-4" />
          <span>{isGenerating ? '生成中...' : `生成 ${batchSize} 个NFT`}</span>
        </button>

        {generatedNFTs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <button
              onClick={downloadImages}
              className="btn-secondary flex items-center justify-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>下载图片</span>
            </button>
            <button
              onClick={downloadMetadata}
              className="btn-secondary flex items-center justify-center space-x-2"
            >
              <FileText className="h-4 w-4" />
              <span>下载Metadata</span>
            </button>
            <button
              onClick={downloadReport}
              className="btn-secondary flex items-center justify-center space-x-2"
            >
              <Settings className="h-4 w-4" />
              <span>下载报告</span>
            </button>
          </div>
        )}
      </div>

      {/* 生成状态 */}
      {generatedNFTs.length > 0 && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-green-800">
            ✅ 已生成 {generatedNFTs.length} 个NFT，可以下载图片和metadata文件
          </p>
        </div>
      )}
    </div>
  )
} 