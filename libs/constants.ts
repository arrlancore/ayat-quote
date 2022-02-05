import { BackgroundType } from './model/quote'
import { imageSize } from './model/shared'

export const homeLabels = {
  pageTitle: 'NaisQuotes',
  pageDescription: 'Bikin quotes atau konten sosial media online dengan kuoots free tools, gratis',
  sidebarTitle: 'Properties',
  sidebarLayout: 'Layout Size',
  sidebarBackground: 'Background',
  sidebarText: 'Text',
  sidebarBrands: 'Brands',
}

export const quoteBackgroundTypes = {
  COLOR: 'Color' as BackgroundType,
  CUSTOM_IMAGE: 'Custom Image' as BackgroundType,
  RANDOM_IMAGE: 'Random Image' as BackgroundType,
}

/**
 * @type [[width, height]]
 */
export const layoutSizes: Array<imageSize> = [
  { width: 1080, height: 1080 },
  { width: 1080, height: 1350 },
]
