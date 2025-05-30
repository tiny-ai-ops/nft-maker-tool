import React, { useState } from 'react'
import { useProjectStore } from '../stores/projectStore'
import { Settings, Percent, Weight } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface RarityEditorProps {
  projectId: string
}

export default function RarityEditor({ projectId }: RarityEditorProps) {
  const { projects, updateTrait } = useProjectStore()
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null)

  const project = projects.find(p => p.id === projectId)
  if (!project) return null

  const sortedLayers = [...project.layers].sort((a, b) => a.order - b.order)

  const handleRarityChange = (layerId: string, traitId: string, rarity: number) => {
    // 稀有度越低，权重越高（反比关系）
    const weight = Math.max(1, Math.round(100 / Math.max(1, rarity)))
    updateTrait(projectId, layerId, traitId, { rarity, weight })
  }

  const handleWeightChange = (layerId: string, traitId: string, weight: number) => {
    updateTrait(projectId, layerId, traitId, { weight })
  }

  const calculateTotalWeight = (layerId: string) => {
    const layer = project.layers.find(l => l.id === layerId)
    return layer ? layer.traits.reduce((sum, trait) => sum + trait.weight, 0) : 0
  }

  const calculateActualRarity = (layerId: string, traitWeight: number) => {
    const totalWeight = calculateTotalWeight(layerId)
    return totalWeight > 0 ? ((traitWeight / totalWeight) * 100).toFixed(1) : '0'
  }

  const autoBalanceWeights = (layerId: string) => {
    const layer = project.layers.find(l => l.id === layerId)
    if (!layer || layer.traits.length === 0) return

    // 平均分配权重
    const equalWeight = Math.round(100 / layer.traits.length)
    
    layer.traits.forEach(trait => {
      updateTrait(projectId, layerId, trait.id, { 
        weight: equalWeight,
        rarity: parseFloat(calculateActualRarity(layerId, equalWeight))
      })
    })

    toast.success('权重已平均分配')
  }

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-4">
        <Settings className="h-5 w-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">稀有度设置</h3>
      </div>

      {sortedLayers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>还没有图层</p>
          <p className="text-sm">请先创建图层并上传素材</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* 图层选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              选择图层
            </label>
            <select
              value={selectedLayer || ''}
              onChange={(e) => setSelectedLayer(e.target.value || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">选择要编辑的图层...</option>
              {sortedLayers.map((layer, index) => (
                <option key={layer.id} value={layer.id}>
                  #{index + 1} {layer.name} ({layer.traits.length} 个素材)
                </option>
              ))}
            </select>
          </div>

          {/* 稀有度编辑 */}
          {selectedLayer && (() => {
            const layer = project.layers.find(l => l.id === selectedLayer)
            if (!layer || layer.traits.length === 0) {
              return (
                <div className="text-center py-8 text-gray-500">
                  <p>该图层还没有素材</p>
                  <p className="text-sm">请先上传素材</p>
                </div>
              )
            }

            const totalWeight = calculateTotalWeight(selectedLayer)

            return (
              <div className="space-y-4">
                {/* 图层信息 */}
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-purple-900">{layer.name}</h4>
                    <button
                      onClick={() => autoBalanceWeights(selectedLayer)}
                      className="text-sm bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                    >
                      平均分配
                    </button>
                  </div>
                  <div className="text-sm text-purple-700">
                    总权重: {totalWeight} | 素材数量: {layer.traits.length}
                  </div>
                </div>

                {/* 素材列表 */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {layer.traits.map((trait) => (
                    <div key={trait.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                          <img
                            src={trait.fileData}
                            alt={trait.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{trait.name}</p>
                          <p className="text-sm text-gray-500">
                            实际稀有度: {calculateActualRarity(selectedLayer, trait.weight)}%
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {/* 稀有度设置 */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            <Percent className="h-3 w-3 inline mr-1" />
                            目标稀有度 (%)
                          </label>
                          <input
                            type="number"
                            value={trait.rarity}
                            onChange={(e) => {
                              const rarity = Math.max(0.1, Math.min(100, parseFloat(e.target.value) || 0.1))
                              handleRarityChange(selectedLayer, trait.id, rarity)
                            }}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                            min="0.1"
                            max="100"
                            step="0.1"
                          />
                        </div>

                        {/* 权重设置 */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            <Weight className="h-3 w-3 inline mr-1" />
                            权重
                          </label>
                          <input
                            type="number"
                            value={trait.weight}
                            onChange={(e) => {
                              const weight = Math.max(1, parseInt(e.target.value) || 1)
                              handleWeightChange(selectedLayer, trait.id, weight)
                            }}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                            min="1"
                            max="1000"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 稀有度分布预览 */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-900 mb-2">稀有度分布预览</h5>
                  <div className="space-y-1">
                    {layer.traits
                      .sort((a, b) => b.weight - a.weight)
                      .map((trait) => {
                        const actualRarity = parseFloat(calculateActualRarity(selectedLayer, trait.weight))
                        return (
                          <div key={trait.id} className="flex justify-between text-xs">
                            <span className="truncate flex-1 mr-2">{trait.name}</span>
                            <span className="text-gray-600">{actualRarity}%</span>
                          </div>
                        )
                      })}
                  </div>
                </div>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
} 