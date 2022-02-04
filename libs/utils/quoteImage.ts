import { quoteBackgroundTypes } from '../constants'
import { quoteCanvasConfig, quoteConfig, textImage } from '../model/quote'
import { fileMeta, imageSize } from '../model/shared'
import gradients from './gradients'
import { loadImg } from './image'

type colorGradientCanvas = {
  color: string
  stop: number
}

export class QuoteImage {
  width = 0
  height = 0
  layoutWidth = 0
  layoutHeight = 0
  fontFamily =
    "-apple-system, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
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
    // this.canvas.oncontextmenu = function (e) {
    //   e.preventDefault()
    //   e.stopPropagation()
    // }
    return this.canvas.getContext('2d')
  }

  getDataUrl() {
    return this.canvas.toDataURL()
  }

  async preprocessDraw(quoteConfig: quoteConfig) {
    try {
      // load image background
      let bgConfig: [HTMLImageElement, imageSize]
      if (
        quoteConfig.backgroundType === quoteBackgroundTypes.CUSTOM_IMAGE &&
        quoteConfig.background
      ) {
        const { width, height } = quoteConfig.background?.meta as fileMeta
        bgConfig = [quoteConfig.background?.image as HTMLImageElement, { width, height }]
      } else if (
        quoteConfig.backgroundType === quoteBackgroundTypes.RANDOM_IMAGE &&
        quoteConfig.randomImage
      ) {
        bgConfig = [
          quoteConfig.randomImage as HTMLImageElement,
          { width: this.width, height: this.height },
        ]
      } else {
        const gradient = gradients[quoteConfig.gradientColorIndex]
        const { angle, colors } = this.toLinearData(gradient.backgroundImage)
        bgConfig = await this.createGradientBackground(colors, angle, this.width, this.height)
      }

      // load image text
      const txtConfig = await this.createTextImage(
        {
          mainText: quoteConfig.primaryText || '',
          author: quoteConfig.author || '',
          openingText: quoteConfig.openingText || '',
        },
        2
      )

      // load image brand
      const logoConfig: { image: HTMLImageElement | undefined; meta: imageSize | undefined } = {
        image: undefined,
        meta: undefined,
      }
      const logoTextConfig: { image: HTMLImageElement | undefined; meta: imageSize | undefined } = {
        image: undefined,
        meta: undefined,
      }
      if (quoteConfig.brand?.image) {
        logoConfig.image = quoteConfig.brand.image
        logoConfig.meta = quoteConfig.brand.meta as fileMeta
      }
      if (quoteConfig.brandingText) {
        const createdText = await this.createTextBrand(quoteConfig.brandingText || '')
        logoTextConfig.image = createdText[0]
        logoTextConfig.meta = createdText[1]
      }

      const quoteCanvasConfig: quoteCanvasConfig = {
        background: {
          image: bgConfig[0],
          meta: bgConfig[1],
        },
        maskColorDark: quoteConfig.darkBackground,
        text: {
          image: txtConfig[0],
          meta: txtConfig[1],
        },
        logo: {
          image: logoConfig.image,
          meta: logoConfig.meta,
        },
        textLogo: {
          image: logoTextConfig.image,
          meta: logoTextConfig.meta,
        },
      }

      this.applyToCanvas(quoteCanvasConfig)
    } catch (error) {
      console.log('error:', error)
      if (error instanceof Error) {
        console.log('error.message:', error.message)
      }
    }
  }

  applyToCanvas(config: quoteCanvasConfig) {
    const context = this.getContext() as CanvasRenderingContext2D

    // clearing canvas
    context.clearRect(0, 0, this.width, this.height)

    // 1. draw a background
    context.drawImage(config.background.image, 0, 0)
    // 2. draw mask color
    if (config.maskColorDark) {
      context.save()
      context.fillStyle = 'rgba(0, 0, 0, 0.6)'
      context.fillRect(0, 0, this.width, this.height)
      context.restore()
    }

    // 3. draw image text latin
    if (config.text?.image) {
      context.drawImage(config.text.image, 0, 0, this.layoutWidth, this.layoutHeight)
    }

    // 4. draw logo brand at bottom center
    if (config.logo?.image) {
      const logoDimension = 42
      const halfLayout = this.layoutWidth / 2
      const halfLogo = logoDimension / 2
      context.drawImage(
        config.logo.image,
        0,
        0,
        config.logo.meta?.width || 0,
        config.logo.meta?.height || 0,
        halfLayout - halfLogo,
        this.layoutHeight - logoDimension * 2.5,
        logoDimension,
        logoDimension
      )
    }
    // 4. draw logo brand at bottom center
    if (config.textLogo?.image) {
      context.drawImage(config.textLogo.image, 0, this.height / 2 - 30)
    }
  }

  async createTextImage(config: textImage, scale = 1) {
    const svgWidth = this.layoutWidth * scale
    const svgHeight = this.layoutHeight * scale
    const downsideLayout = 40 * scale

    const mainText = config.mainText ? `<p style="font-weight:bold">${config.mainText}</p>` : ''
    const sourceText = config.author ? `<p class="source-text">${config.author}</p>` : ''
    const openingText = `<p><small style="text-decoration: underline; font-size: 2.5vw;">${config.openingText}</small></p>`

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
            background: rgb(100, 100, 100, 0.2);
            display: inline-block;
            padding: 1vw 2vw;
            border-radius: 100px;
            font-family: ${this.fontFamily}, sans-serif;
            font-style: normal;
            font-size: 3vw;
            border: 1vw solid white;
          }
          div {
              margin:0;
              font-weight: normal;
              font-family: ${this.fontFamily}, sans-serif;
              font-size: 4vw;
              line-height: 5vw;
              padding: 0vw 8vw 1vw;
              color: white;
              vertical-align: middle;
              width: ${svgWidth - downsideLayout}px;
              height: ${svgHeight - downsideLayout}px;
              display: table-cell;
              font-style: italic;
          }
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

  createTextBrand(txt: string, scale = 1): Promise<[HTMLImageElement, imageSize]> {
    const svgWidth = this.width * scale
    const svgHeight = this.height * scale
    const downsideLayout = 10 * scale
    const logoTxt = `<p>${txt}</p>`
    // Generate SVG code with JavaScript
    // Note that we wrap the paragraph HTML in a <div>
    const svgCode = `
    <svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
        <foreignObject x="0" y="0" width="${svgWidth}" height="${svgHeight}">
            <style>
            p {
                font-family: ${this.fontFamily}, sans-serif;
                font-size: 2.5vw;
                color: white;
                vertical-align: middle;
                width: ${svgWidth - downsideLayout}px;
                height: ${svgHeight - downsideLayout}px;
                display: table-cell;
                text-decoration: underline;
                text-align: center;
            }
            </style>
            <div xmlns="http://www.w3.org/1999/xhtml">
                ${logoTxt}
            </div>
        </foreignObject>
    </svg>`
    // Remove newlines and replace double quotes with single quotes
    const svgCodeEncoded = svgCode.replace(/\n/g, '').replace(/"/g, "'")
    return loadImg(`data:image/svg+xml,${svgCodeEncoded}`)
  }

  private toLinearData(linearGradient: string): { angle: number; colors: colorGradientCanvas[] } {
    const startIndex = linearGradient.search(/\(/) + 1
    const arr = linearGradient.substring(startIndex, linearGradient.length - 1).split(',')
    const angle = Number(arr[0].replace(/deg/, ''))
    const colors = arr.splice(1).map((data) => {
      const dataArr = data.split(' ').filter(Boolean)
      return { color: dataArr[0], stop: Number(dataArr[1].replace(/%/, '')) }
    })

    return { angle, colors }
  }

  createGradientBackground(
    // context: CanvasRenderingContext2D,
    colors: colorGradientCanvas[],
    angle: number,
    width: number,
    height: number
  ) {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d') as CanvasRenderingContext2D
    const toFloat = (n: number) => {
      const val = n / 100
      return Math.round(val * 10) / 10
    }
    const length = width
    const [x, y] = [0, 0]
    const grd = context.createLinearGradient(
      x,
      y,
      x + Math.cos(angle) * length,
      y + Math.sin(angle) * length + width / 2
    )

    for (let i = 0; i < colors.length; i++) {
      const data = colors[i]
      grd.addColorStop(toFloat(data.stop), data.color)
    }

    // Fill with gradient
    context.save()
    context.fillStyle = grd
    context.fillRect(0, 0, width, height)
    context.restore()

    const dataUrl = canvas.toDataURL()
    canvas.remove()

    return loadImg(dataUrl)
  }
}
