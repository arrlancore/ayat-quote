import { imageSize } from '../model/shared'

export function getRandomImageUrl(width: number, height: number, kind = 'forest') {
  return fetch(`https://source.unsplash.com/${width}x${height}/?${kind}`).then((data) => data.url)
}

// /**
//  *
//  * @param {string} src
//  * @returns [image, width, height]
//  */
// export function loadImg(src: string): Promise<[HTMLImageElement, imageSize]> {
//   return new Promise((res, rej) => {
//     const img = new Image()
//     img.src = src
//     img.onload = function () {
//       res([img, { width: img.width, height: img.height }])
//     }
//     img.onerror = rej
//   })
// }

export async function loadImg(url: string): Promise<[HTMLImageElement, imageSize]> {
  return new Promise((resolve, reject) => {
    window
      .fetch(url)
      .then((resp) => resp.blob())
      .then((blob) => {
        const urlFromBlob = window.URL.createObjectURL(blob)

        const image = new window.Image()
        image.src = urlFromBlob
        image.crossOrigin = 'anonymous'
        image.addEventListener('load', () => {
          resolve([image, { width: image.width, height: image.height }])
        })
        image.addEventListener('error', reject)
      })
  })
}
