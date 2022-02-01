import { fileMeta } from './shared'

export interface drawConfig {
  background?: {
    image: HTMLImageElement
    meta: fileMeta
  }
  text: {
    image: HTMLImageElement
    meta: fileMeta
  }
  logo?: {
    image: HTMLImageElement
    meta: fileMeta
  }
  maskColor?: string
}
