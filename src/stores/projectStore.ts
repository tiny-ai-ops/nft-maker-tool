import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Project, Layer, Trait } from '../types'

interface ProjectState {
  projects: Project[]
  currentProject: Project | null
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
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [],
      currentProject: null,
      
      createProject: (name: string, description: string) => {
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
      },
      
      updateProject: (projectId: string, updates: Partial<Project>) => {
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
      },
      
      deleteProject: (projectId: string) => {
        set(state => ({
          projects: state.projects.filter(p => p.id !== projectId),
          currentProject: state.currentProject?.id === projectId ? null : state.currentProject
        }))
      },
      
      setCurrentProject: (project: Project | null) => {
        set({ currentProject: project })
      },
      
      addLayer: (projectId: string, layerName: string) => {
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
      },
      
      updateLayer: (projectId: string, layerId: string, updates: Partial<Layer>) => {
        const project = get().projects.find(p => p.id === projectId)
        if (!project) return
        
        const updatedLayers = project.layers.map(layer =>
          layer.id === layerId ? { ...layer, ...updates } : layer
        )
        
        get().updateProject(projectId, { layers: updatedLayers })
      },
      
      deleteLayer: (projectId: string, layerId: string) => {
        const project = get().projects.find(p => p.id === projectId)
        if (!project) return
        
        const updatedLayers = project.layers.filter(layer => layer.id !== layerId)
        const reorderedLayers = updatedLayers.map((layer, index) => ({
          ...layer,
          order: index
        }))
        
        get().updateProject(projectId, { layers: reorderedLayers })
      },
      
      moveLayerUp: (projectId: string, layerId: string) => {
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
      },
      
      moveLayerDown: (projectId: string, layerId: string) => {
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
      },
      
      reorderLayers: (projectId: string, layerIds: string[]) => {
        const project = get().projects.find(p => p.id === projectId)
        if (!project) return

        const updatedLayers = project.layers.map(layer => {
          const newOrder = layerIds.indexOf(layer.id)
          return newOrder !== -1 ? { ...layer, order: newOrder } : layer
        })

        get().updateProject(projectId, { layers: updatedLayers })
      },
      
      addTrait: (projectId: string, layerId: string, trait: Omit<Trait, 'id'>) => {
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
      },
      
      updateTrait: (projectId: string, layerId: string, traitId: string, updates: Partial<Trait>) => {
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
      },
      
      deleteTrait: (projectId: string, layerId: string, traitId: string) => {
        const project = get().projects.find(p => p.id === projectId)
        if (!project) return
        
        const updatedLayers = project.layers.map(layer =>
          layer.id === layerId 
            ? { ...layer, traits: layer.traits.filter(trait => trait.id !== traitId) }
            : layer
        )
        
        get().updateProject(projectId, { layers: updatedLayers })
      }
    }),
    {
      name: 'project-storage'
    }
  )
) 