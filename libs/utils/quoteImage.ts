import { drawConfig, textImage } from '../model/quote'
import { loadImg } from './image'

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

  normalizeText(txt: string) {
    const removeComaText = txt[txt.length - 1] === ',' ? txt.substring(0, txt.length - 1) : txt
    return removeComaText[0].toUpperCase() + removeComaText.substring(1)
  }

  getContext() {
    this.canvas.width = this.width
    this.canvas.height = this.height
    // avoid right click on canvas
    this.canvas.oncontextmenu = function (e) {
      e.preventDefault()
      e.stopPropagation()
    }
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
  async createTextImage(config: textImage, scale = 1) {
    const svgWidth = this.layoutWidth * scale
    const svgHeight = this.layoutHeight * scale
    const downsideLayout = 40 * scale

    const font =
      "-apple-system, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"

    const mainText = config.mainText ? `<p style="font-weight:bold">${config.mainText}</p>` : ''
    const sourceText = config.author ? `<p class="source-text">${config.author}</p>` : ''
    const openingText = `<p><small style="text-decoration: underline; font-size: 2vw;">${config.openingText}</small></p>`

    const textElement = `<div>
      ${openingText}
      ${mainText}
      ${sourceText}
    </div>`
    // Generate SVG code with JavaScript
    // Note that we wrap the paragraph HTML in a <div>
    const svgCode = `
  <svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
      <foreignObject x="0" y="0" width="${svgWidth}" height="${svgHeight}">
          <style>
          .source-text {
            background: rgb(185, 77, 248);
            display: inline-block;
            padding: 1vw 2vw;
            background: rgb(0,0,0);
            background: linear-gradient(to bottom right, rgba(40, 40, 40, 0.5), rgba(0, 0, 0, 0.5));
            border-radius: 100px;
            font-family: ${font}, sans-serif;
            font-style: normal;
            font-size: 3vw;
            border: 1vw solid white;
          }
          div {
              margin:0;
              font-weight: normal;
              font-family: ${font}, sans-serif;
              font-size: 4vw;
              line-height: 5vw;
              padding: 0vw 8vw 1vw;
              color: white;
              vertical-align: middle;
              width: ${svgWidth - downsideLayout}px;
              height: ${svgHeight - downsideLayout}px;
              display: table-cell;
              font-style: italic;
  p        }
          </style>
          <div xmlns="http://www.w3.org/1999/xhtml">
              ${textElement}
          </div>
      </foreignObject>
  </svg>`
    // Remove newlines and replace double quotes with single quotes
    const svgCodeEncoded = svgCode.replace(/\n/g, '').replace(/"/g, "'")

    return loadImg(`data:image/svg+xml,${svgCodeEncoded}`)
  }
}
