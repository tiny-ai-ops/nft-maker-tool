import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Project, Layer, Trait } from '../types'

// 自动保存状态类型
interface AutoSaveState {
  isAutoSaving: boolean
  lastSavedAt: Date | null
  hasUnsavedChanges: boolean
  autoSaveInterval: number // 秒
}

interface ProjectState {
  projects: Project[]
  currentProject: Project | null
  autoSave: AutoSaveState
  createProject: (name: string, description: string) => Project
  updateProject: (projectId: string, updates: Partial<Project>) => void
  deleteProject: (projectId: string) => void
  setCurrentProject: (project: Project | null) => void
  addLayer: (projectId: string, layerName: string) => void
  updateLayer: (projectId: string, layerId: string, updates: Partial<Layer>) => void
  deleteLayer: (projectId: string, layerId: string) => void
  moveLayerUp: (projectId: string, layerId: string) => void
  moveLayerDown: (projectId: string, layerId: string) => void
  reorderLayers: (projectId: string, layerIds: string[]) => void
  addTrait: (projectId: string, layerId: string, trait: Omit<Trait, 'id'>) => void
  updateTrait: (projectId: string, layerId: string, traitId: string, updates: Partial<Trait>) => void
  deleteTrait: (projectId: string, layerId: string, traitId: string) => void
  // 自动保存相关方法
  setAutoSaving: (isAutoSaving: boolean) => void
  markSaved: () => void
  markUnsaved: () => void
  setAutoSaveInterval: (interval: number) => void
  exportProject: (projectId: string) => string
  importProject: (projectData: string) => Project
}

// 创建自动保存的包装函数
const withAutoSave = (fn: any) => {
  return (...args: any[]) => {
    const result = fn(...args)
    // 标记有未保存的更改
    useProjectStore.getState().markUnsaved()
    return result
  }
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [],
      currentProject: null,
      autoSave: {
        isAutoSaving: false,
        lastSavedAt: null,
        hasUnsavedChanges: false,
        autoSaveInterval: 30 // 默认30秒自动保存
      },
      
      createProject: withAutoSave((name: string, description: string) => {
        const newProject: Project = {
          id: `project_${Date.now()}`,
          name,
          description,
          createdAt: new Date(),
          updatedAt: new Date(),
          layers: [],
          settings: {
            width: 1000,
            height: 1000,
            totalSupply: 10000,
            backgroundColor: '#FFFFFF',
            format: 'png',
            quality: 90,
            compressionLevel: 6,
            presetSizes: false,
            customSize: true
          }
        }
        
        set(state => ({
          projects: [...state.projects, newProject],
          currentProject: newProject
        }))
        
        return newProject
      }),
      
      updateProject: withAutoSave((projectId: string, updates: Partial<Project>) => {
        set(state => ({
          projects: state.projects.map(p => 
            p.id === projectId 
              ? { ...p, ...updates, updatedAt: new Date() }
              : p
          ),
          currentProject: state.currentProject?.id === projectId 
            ? { ...state.currentProject, ...updates, updatedAt: new Date() }
            : state.currentProject
        }))
      }),
      
      deleteProject: withAutoSave((projectId: string) => {
        set(state => ({
          projects: state.projects.filter(p => p.id !== projectId),
          currentProject: state.currentProject?.id === projectId ? null : state.currentProject
        }))
      }),
      
      setCurrentProject: (project: Project | null) => {
        set({ currentProject: project })
      },
      
      addLayer: withAutoSave((projectId: string, layerName: string) => {
        const newLayer: Layer = {
          id: `layer_${Date.now()}`,
          name: layerName,
          order: get().projects.find(p => p.id === projectId)?.layers.length || 0,
          traits: [],
          isVisible: true
        }
        
        get().updateProject(projectId, {
          layers: [...(get().projects.find(p => p.id === projectId)?.layers || []), newLayer]
        })
      }),
      
      updateLayer: withAutoSave((projectId: string, layerId: string, updates: Partial<Layer>) => {
        const project = get().projects.find(p => p.id === projectId)
        if (!project) return
        
        const updatedLayers = project.layers.map(layer =>
          layer.id === layerId ? { ...layer, ...updates } : layer
        )
        
        get().updateProject(projectId, { layers: updatedLayers })
      }),
      
      deleteLayer: withAutoSave((projectId: string, layerId: string) => {
        const project = get().projects.find(p => p.id === projectId)
        if (!project) return
        
        const updatedLayers = project.layers.filter(layer => layer.id !== layerId)
        const reorderedLayers = updatedLayers.map((layer, index) => ({
          ...layer,
          order: index
        }))
        
        get().updateProject(projectId, { layers: reorderedLayers })
      }),
      
      moveLayerUp: withAutoSave((projectId: string, layerId: string) => {
        const project = get().projects.find(p => p.id === projectId)
        if (!project) return

        const layers = [...project.layers].sort((a, b) => a.order - b.order)
        const currentIndex = layers.findIndex(layer => layer.id === layerId)
        
        if (currentIndex > 0) {
          const temp = layers[currentIndex].order
          layers[currentIndex].order = layers[currentIndex - 1].order
          layers[currentIndex - 1].order = temp
          
          get().updateProject(projectId, { layers })
        }
      }),
      
      moveLayerDown: withAutoSave((projectId: string, layerId: string) => {
        const project = get().projects.find(p => p.id === projectId)
        if (!project) return

        const layers = [...project.layers].sort((a, b) => a.order - b.order)
        const currentIndex = layers.findIndex(layer => layer.id === layerId)
        
        if (currentIndex < layers.length - 1) {
          const temp = layers[currentIndex].order
          layers[currentIndex].order = layers[currentIndex + 1].order
          layers[currentIndex + 1].order = temp
          
          get().updateProject(projectId, { layers })
        }
      }),
      
      reorderLayers: withAutoSave((projectId: string, layerIds: string[]) => {
        const project = get().projects.find(p => p.id === projectId)
        if (!project) return

        const updatedLayers = project.layers.map(layer => {
          const newOrder = layerIds.indexOf(layer.id)
          return newOrder !== -1 ? { ...layer, order: newOrder } : layer
        })

        get().updateProject(projectId, { layers: updatedLayers })
      }),
      
      addTrait: withAutoSave((projectId: string, layerId: string, trait: Omit<Trait, 'id'>) => {
        const newTrait: Trait = {
          ...trait,
          id: `trait_${Date.now()}`
        }
        
        const project = get().projects.find(p => p.id === projectId)
        if (!project) return
        
        const updatedLayers = project.layers.map(layer =>
          layer.id === layerId 
            ? { ...layer, traits: [...layer.traits, newTrait] }
            : layer
        )
        
        get().updateProject(projectId, { layers: updatedLayers })
      }),
      
      updateTrait: withAutoSave((projectId: string, layerId: string, traitId: string, updates: Partial<Trait>) => {
        const project = get().projects.find(p => p.id === projectId)
        if (!project) return
        
        const updatedLayers = project.layers.map(layer =>
          layer.id === layerId 
            ? {
                ...layer,
                traits: layer.traits.map(trait =>
                  trait.id === traitId ? { ...trait, ...updates } : trait
                )
              }
            : layer
        )
        
        get().updateProject(projectId, { layers: updatedLayers })
      }),
      
      deleteTrait: withAutoSave((projectId: string, layerId: string, traitId: string) => {
        const project = get().projects.find(p => p.id === projectId)
        if (!project) return
        
        const updatedLayers = project.layers.map(layer =>
          layer.id === layerId 
            ? { ...layer, traits: layer.traits.filter(trait => trait.id !== traitId) }
            : layer
        )
        
        get().updateProject(projectId, { layers: updatedLayers })
      }),

      // 自动保存相关方法
      setAutoSaving: (isAutoSaving: boolean) => {
        set(state => ({
          autoSave: { ...state.autoSave, isAutoSaving }
        }))
      },

      markSaved: () => {
        set(state => ({
          autoSave: { 
            ...state.autoSave, 
            hasUnsavedChanges: false,
            lastSavedAt: new Date(),
            isAutoSaving: false
          }
        }))
      },

      markUnsaved: () => {
        set(state => ({
          autoSave: { 
            ...state.autoSave, 
            hasUnsavedChanges: true
          }
        }))
      },

      setAutoSaveInterval: (interval: number) => {
        set(state => ({
          autoSave: { ...state.autoSave, autoSaveInterval: interval }
        }))
      },

      // 导出项目数据
      exportProject: (projectId: string) => {
        const project = get().projects.find(p => p.id === projectId)
        if (!project) throw new Error('项目未找到')
        
        const exportData = {
          version: '1.0',
          exportedAt: new Date().toISOString(),
          project
        }
        
        return JSON.stringify(exportData, null, 2)
      },

      // 导入项目数据
      importProject: (projectData: string) => {
        try {
          const data = JSON.parse(projectData)
          const project = data.project
          
          // 生成新的ID避免冲突
          const newProject = {
            ...project,
            id: `project_${Date.now()}`,
            name: `${project.name} (导入)`,
            createdAt: new Date(),
            updatedAt: new Date()
          }
          
          set(state => ({
            projects: [...state.projects, newProject]
          }))
          
          return newProject
        } catch (error) {
          throw new Error('导入数据格式错误')
        }
      }
    }),
    {
      name: 'project-storage'
    }
  )
) 