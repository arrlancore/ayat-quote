export interface fileMeta {
  filename?: string
  width: number
  height: number
  size?: number
  type?: string
}

export interface imageSize {
  width: number
  height: number
}

export interface htmlHeadConfig {
  title: string
  description: string
  faviconUrl?: string
}
