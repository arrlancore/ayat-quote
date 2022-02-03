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
  hasCustomBackground: boolean
  gradientColorIndex: number
  darkBackground: boolean
}

export interface textImage {
  mainText: string
  author: string
  openingText: string
}
