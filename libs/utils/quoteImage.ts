import { drawConfig } from '../model/quoteImage'

export class QuoteImage {
  width = 0
  height = 0
  layoutWidth = 0
  layoutHeight = 0
  canvas: HTMLCanvasElement
  constructor(
    layoutWidth: number,
    layoutHeight: number,
    scale: number,
    canvasSelector = 'quote-canvas'
  ) {
    this.width = layoutWidth * scale
    this.height = layoutHeight * scale
    this.layoutWidth = layoutWidth
    this.layoutHeight = layoutHeight
    this.canvas = document.getElementById(canvasSelector) as HTMLCanvasElement
  }

  getContext() {
    this.canvas.width = this.width
    this.canvas.height = this.height
    return this.canvas.getContext('2d')
  }

  getDataUrl() {
    return this.canvas.toDataURL()
  }

  draw(config: drawConfig) {
    const context = this.getContext() as CanvasRenderingContext2D

    // clearing canvas
    context.clearRect(0, 0, this.width, this.height)

    // 1. draw a background
    if (config.background?.image) {
      context.drawImage(config.background.image, 0, 0)
    }
    // 2. draw mask color
    context.save()
    context.fillStyle = config.maskColor || 'rgba(0, 0, 0, 0.6)'
    context.fillRect(0, 0, this.width, this.height)
    context.restore()

    // 3. draw image text latin
    context.drawImage(config.text.image, 0, 0, this.layoutWidth, this.layoutHeight)

    // 4. draw logo brand at bottom center
    if (config.logo?.image) {
      const halfLayout = this.layoutWidth / 2
      const halfLogo = 240 / 2
      context.drawImage(
        config.logo.image,
        0,
        0,
        config.logo.meta.width,
        config.logo.meta.height,
        halfLayout - halfLogo,
        this.layoutHeight - 200,
        240,
        240
      )
    }
  }
}
