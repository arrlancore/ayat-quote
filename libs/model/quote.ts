import { fileMeta, imageSize } from './shared'

export interface quoteCanvasConfig {
  background: {
    image: HTMLImageElement
    meta: fileMeta | imageSize
  }
  text?: {
    image: HTMLImageElement
    meta: imageSize
  }
  logo?: {
    image: HTMLImageElement
    meta: fileMeta
  }
  maskColorDark: boolean
}

export type BackgroundType = 'Color' | 'CustomImage' | 'RandomImage'

export interface quoteConfig {
  openingText?: string
  primaryText: string
  author?: string
  brandingText?: string
  brand?: {
    image?: HTMLImageElement
    meta?: fileMeta
  }
  background?: {
    image: HTMLImageElement
    meta: fileMeta
  }
  randomImage?: HTMLImageElement
  hasCustomBrandImage: boolean
  gradientColorIndex: number
  darkBackground: boolean
  backgroundType: BackgroundType
}

export interface textImage {
  mainText: string
  author: string
  openingText: string
}
