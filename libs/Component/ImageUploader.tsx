import { Text } from '@nextui-org/react'
import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { fileMeta } from '../model/shared'

type onImagePlaced = (image: HTMLImageElement, meta: fileMeta) => void

const ImageUploader = (props: { onChange: onImagePlaced; label: string }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/jpeg, image/png',
    maxFiles: 1,
    onDrop: useCallback(
      (acceptedFiles: Array<File>) => {
        if (FileReader && acceptedFiles && acceptedFiles.length) {
          const file = acceptedFiles[0]
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = function () {
            const dataUrl = reader.result as string
            const image = document.createElement('img')
            image.src = dataUrl
            image.onload = function () {
              props.onChange(image, {
                width: image.width,
                height: image.height,
                filename: file.name,
                size: file.size,
                type: file.type,
              })
            }
          }
        }
      },
      [props]
    ),
  })
  return (
    <div
      style={{ border: '2px dashed #666', padding: '1em', cursor: 'pointer' }}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {props.label ? (
        // <Row justify="flex-start" align="center">
        //   <Image
        //     css={{ borderRadius: 0, width: 80, height: 80, objectFit: 'cover' }}
        //     alt=""
        //     src={url}
        //   />
        //   <Spacer x={1} />
        <Text small>{props.label}</Text>
      ) : (
        // </Row>
        <>
          <Text css={{ color: '#aaa' }} small>
            Click or drag an image here. Only *.jpeg and *.png images will be accepted
          </Text>
        </>
      )}
    </div>
  )
}

export default ImageUploader
