import { fileMeta, imageSize } from './shared'

export interface drawConfig {
  background?: {
    image: HTMLImageElement
    meta: fileMeta | imageSize
  }
  text: {
    image: HTMLImageElement
    meta: imageSize
  }
  logo?: {
    image: HTMLImageElement
    meta: fileMeta
  }
  maskColor?: string
}

export interface textImage {
  mainText: string
  author: string
  openingText: string
}
