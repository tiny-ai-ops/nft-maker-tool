export interface User {
  id: string
  email: string
  activated: boolean
  activationCode?: string
}

export interface Project {
  id: string
  name: string
  description: string
  createdAt: Date
  updatedAt: Date
  layers: Layer[]
  settings: ProjectSettings
}

export interface Layer {
  id: string
  name: string
  order: number
  traits: Trait[]
  isVisible: boolean
}

export interface Trait {
  id: string
  name: string
  fileName: string
  fileData: string // base64 image data
  rarity: number // percentage (0-100)
  weight: number
}

export interface ProjectSettings {
  width: number
  height: number
  totalSupply: number
  backgroundColor: string
  format: 'png' | 'jpg'
}

export interface NFTMetadata {
  name: string
  description: string
  image: string
  attributes: Attribute[]
}

export interface Attribute {
  trait_type: string
  value: string
  rarity?: number
}

export interface GeneratedNFT {
  id: number
  imageData: string
  metadata: NFTMetadata
  traits: { [layerName: string]: string }
} 