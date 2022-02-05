/**
 * @todo
 * - allow text and logo brand [x]
 * - layout option [x]
 * - react color picker [ ]
 */

import type { NextPage } from 'next'
import * as NextImage from 'next/image'
import styles from '../styles/Home.module.css'
import {
  Button,
  Card,
  Checkbox,
  CSS,
  Grid,
  Input,
  Link,
  Loading,
  Radio,
  Spacer,
  Text,
} from '@nextui-org/react'
import { Container, Row, Col } from '@nextui-org/react'
import { homeLabels, layoutSizes, quoteBackgroundTypes } from '../libs/constants'
import { fileMeta, imageSize } from '../libs/model/shared'
import ImageUploader from '../libs/Component/ImageUploader'
import React from 'react'
import HtmlHead from '../libs/Component/HtmlHead'
import { findMatch, generateCaptionIg, getRandomAyat } from '../libs/utils/common'
import { getRandomImageUrl, loadImg } from '../libs/utils/image'
import { QuoteImage } from '../libs/utils/quoteImage'
import gradients from '../libs/utils/gradients'
import { quoteConfig } from '../libs/model/quote'

const defaultCardStyle: CSS = {
  borderRadius: 0,
}

const Header = () => {
  return (
    <header style={{ width: '100%', height: 80, background: 'black' }}>
      <Container gap={0}>
        <Row gap={0}>
          <Col>
            <Text
              h1
              size={30}
              css={{
                textGradient: '45deg, $yellow500 -20%, $red500 100%',
                lineHeight: '80px',
              }}
              weight="bold"
            >
              {homeLabels.pageTitle}
            </Text>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    </header>
  )
}

const HomePage: NextPage = () => {
  const [loading, setLoading] = React.useState(false)
  const [layoutSize, setLayoutSize] = React.useState<imageSize>(layoutSizes[0])
  const [formData, setFormData] = React.useState<quoteConfig>({
    // initial data
    primaryText: 'Tali yang paling kuat untuk tempat bergantung adalah tali pertolongan Allah',
    gradientColorIndex: 0,
    darkBackground: true,
    hasCustomBrandImage: false,
    backgroundType: quoteBackgroundTypes.COLOR,
    author: '~ Buya Hamka',
    brandingText: 'NaisQuotes',
    openingText: 'Bismillah',
  })

  React.useEffect(() => {
    new QuoteImage(layoutSize.width, layoutSize.height, 1).preprocessDraw(formData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, layoutSize])

  const setValueFormData = (
    key: 'openingText' | 'primaryText' | 'author' | 'brandingText',
    value: string
  ) => {
    const data = { ...formData }
    data[key] = value
    setFormData(data)
  }

  const setImageFormData = (
    key: 'brand' | 'background',
    image: HTMLImageElement,
    meta: fileMeta
  ) => {
    const data = { ...formData }
    data[key] = { image, meta }
    setFormData(data)
  }

  const generateAyat = async () => {
    setLoading(true)
    try {
      const [randomAyat, ayatNumber, surah] = await getRandomAyat()
      const author = `QS. ${surah} : ${ayatNumber}`
      const openingText = "Allah subhanahu wa ta'ala berfirman: "
      setFormData({
        ...formData,
        primaryText: randomAyat.idn,
        openingText,
        author,
      })
      setLoading(false)
      console.log(
        await generateCaptionIg(
          surah,
          ayatNumber,
          randomAyat,
          (formData.brandingText || '').replace('@', '')
        )
      )
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  const getRandomImage = async () => {
    setLoading(true)
    try {
      const imgUrl = await getRandomImageUrl(layoutSize.width, layoutSize.height, 'nature')
      const [randomImage] = await loadImg(imgUrl)
      setFormData({ ...formData, randomImage })
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  const renderBGOption = findMatch(formData.backgroundType, [
    {
      option: 'Color',
      callback: () => (
        <Grid.Container gap={1} justify="space-between">
          {gradients.map((style, idx) => (
            <Grid xs={4} md={2} key={`color${idx}`}>
              <Card
                color="gradient"
                css={{ cursor: 'pointer', width: 40, height: 40, ...style }}
                onClick={() => setFormData({ ...formData, gradientColorIndex: idx })}
              />
            </Grid>
          ))}
        </Grid.Container>
      ),
    },
    {
      option: 'Custom Image',
      callback: () => (
        <ImageUploader
          label={formData.background?.meta?.filename || ''}
          onChange={(img, meta) => setImageFormData('background', img, meta)}
        />
      ),
    },
    {
      option: 'Random Image',
      callback: () => (
        <Button onClick={getRandomImage} css={{ width: 100 }}>
          {loading ? <Loading color="white" size="sm" /> : homeLabels.buttonGetRandomImage}
        </Button>
      ),
    },
  ])

  return (
    <>
      <HtmlHead title={homeLabels.pageTitle} description={homeLabels.pageDescription} />
      <Header />
      <Spacer y={1} />
      <Container gap={0} id="container">
        <Row gap={0}>
          <Col>
            <Card
              shadow={false}
              css={{
                minHeight: '80vh',
                ...defaultCardStyle,
              }}
            >
              <Grid.Container gap={1} justify="center">
                <Grid xs={12} lg={6}>
                  <Card shadow={false} bordered css={defaultCardStyle}>
                    <canvas
                      id="quote-canvas"
                      width={layoutSize.width}
                      height={layoutSize.height}
                    ></canvas>
                  </Card>
                </Grid>
                <Grid xs={12} lg={6}>
                  <Card shadow={false} bordered css={defaultCardStyle}>
                    <Text h3>{homeLabels.sidebarTitle}</Text>
                    <Spacer y={2} />

                    <Text h4>{homeLabels.sidebarLayout}</Text>
                    <Spacer y={1} />
                    <Radio.Group row value="primary">
                      {layoutSizes.map(({ width, height }, idx) => {
                        return (
                          <Radio
                            key={idx}
                            size="sm"
                            value={idx}
                            color="primary"
                            onChange={() => setLayoutSize(layoutSizes[idx])}
                            checked={
                              `${width}:${height}` === `${layoutSize.width}:${layoutSize.height}`
                            }
                          >
                            {`${width}x${height}px`}
                          </Radio>
                        )
                      })}
                    </Radio.Group>
                    <Spacer y={2} />

                    <Text h4>{homeLabels.sidebarBackground}</Text>
                    <Spacer y={2} />
                    <Button.Group ghost css={{ width: '100%', margin: 0 }} color="primary">
                      <Button
                        onClick={() =>
                          setFormData({ ...formData, backgroundType: quoteBackgroundTypes.COLOR })
                        }
                        css={{
                          fontWeight:
                            formData.backgroundType == quoteBackgroundTypes.COLOR
                              ? 'bold'
                              : 'normal',
                        }}
                      >
                        Color
                      </Button>
                      <Button
                        css={{
                          fontWeight:
                            formData.backgroundType == quoteBackgroundTypes.CUSTOM_IMAGE
                              ? 'bold'
                              : 'normal',
                        }}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            backgroundType: quoteBackgroundTypes.CUSTOM_IMAGE,
                          })
                        }
                      >
                        Custom Image
                      </Button>
                      <Button
                        css={{
                          fontWeight:
                            formData.backgroundType == quoteBackgroundTypes.RANDOM_IMAGE
                              ? 'bold'
                              : 'normal',
                        }}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            backgroundType: quoteBackgroundTypes.RANDOM_IMAGE,
                          })
                        }
                      >
                        Random Image
                      </Button>
                    </Button.Group>
                    <Spacer y={1} />

                    {renderBGOption}

                    <Spacer y={2} />
                    <Checkbox
                      size="xs"
                      checked={formData.darkBackground}
                      onChange={(e) =>
                        setFormData({ ...formData, darkBackground: e.target.checked })
                      }
                    >
                      Dark Background
                    </Checkbox>
                    <Spacer y={2} />
                    <Text h4>{homeLabels.sidebarText}</Text>
                    <Spacer y={2} />
                    <Input
                      clearable
                      labelPlaceholder="Opening Text"
                      color="primary"
                      value={formData.openingText}
                      onChange={(e) => setValueFormData('openingText', e.target.value)}
                    />
                    <Spacer y={2} />

                    <Input
                      clearable
                      labelPlaceholder="Main Text"
                      color="primary"
                      value={formData.primaryText}
                      onChange={(e) => setValueFormData('primaryText', e.target.value)}
                    />
                    <Spacer y={2} />

                    <Input
                      clearable
                      labelPlaceholder="Author"
                      color="primary"
                      value={formData.author}
                      onChange={(e) => setValueFormData('author', e.target.value)}
                    />
                    <Spacer y={1} />
                    <Button onClick={generateAyat} shadow>
                      {loading ? (
                        <Loading color="white" size="sm" />
                      ) : (
                        homeLabels.buttonCreateRandomAyat
                      )}
                    </Button>
                    <Spacer y={2} />

                    <Text h4>{homeLabels.sidebarBrands}</Text>
                    <Spacer y={2} />
                    <Text small>Branding Logo</Text>
                    <Spacer y={1} />
                    <ImageUploader
                      label={formData.brand?.meta?.filename || ''}
                      onChange={(img, meta) => setImageFormData('brand', img, meta)}
                    />
                    <Spacer y={2} />
                    <Input
                      clearable
                      labelPlaceholder="Branding Text"
                      color="primary"
                      value={formData.brandingText}
                      onChange={(e) => setValueFormData('brandingText', e.target.value)}
                    />
                    <Card.Footer>
                      <Link color="primary" target="_blank" href="#">
                        Untuk menyimpan gambar, klik kanan pada gambar lalu pilih save / simpan
                      </Link>
                    </Card.Footer>
                  </Card>
                </Grid>
              </Grid.Container>
            </Card>
          </Col>
        </Row>
        <Spacer y={1} />
        {/* footer */}
        <Row gap={1}>
          <Col>
            <Card
              shadow={false}
              css={{
                borderRadius: 0,
              }}
            >
              <footer id="footer" className={styles.footer}>
                <a
                  href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Powered by{' '}
                  <span className={styles.logo}>
                    <NextImage.default src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
                  </span>
                </a>
              </footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default HomePage
