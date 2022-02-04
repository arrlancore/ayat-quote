/**
 * @todo
 * - allow text and logo brand [ ]
 * - layout option [ ]
 * - react color picker [ ]
 */

import type { NextPage } from 'next'
import * as NextImage from 'next/image'
import * as htmlToImage from 'html-to-image'
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
  Spacer,
  Switch,
  Text,
} from '@nextui-org/react'
import { Container, Row, Col } from '@nextui-org/react'
import { homeLabels, quoteBackgroundTypes } from '../libs/constants'
import { fileMeta, imageSize } from '../libs/model/shared'
import ImageUploader from '../libs/Component/ImageUploader'
import React from 'react'
import HtmlHead from '../libs/Component/HtmlHead'
import { findMatch, getRandomAyat } from '../libs/utils/common'
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
        <Row gap={1}>
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
  const [isBrandLogo, setIsBrandLogo] = React.useState(false)
  const [layoutSize] = React.useState<imageSize>({ width: 1080, height: 1080 })
  const [formData, setFormData] = React.useState<quoteConfig>({
    primaryText: '',
    gradientColorIndex: 0,
    darkBackground: true,
    hasCustomBrandImage: false,
    backgroundType: quoteBackgroundTypes.COLOR,
  })

  console.log(formData)

  React.useEffect(() => {
    new QuoteImage(layoutSize.width, layoutSize.height, 1).preprocessDraw(formData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData])

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

  const handleDownload = () => {
    const node = document.getElementById('quote-canvas')
    if (node) {
      htmlToImage
        .toJpeg(node)
        .then(function (dataUrl) {
          const link = document.createElement('a')
          link.download = `quote_${Date.now()}.jpg`
          link.href = dataUrl || ''
          link.click()
        })
        .catch(function (error) {
          console.error('oops, something went wrong!', error)
        })
    }
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
        <Button onClick={getRandomImage} bordered color="default" css={{ width: 100 }}>
          {loading ? <Loading color="white" size="sm" /> : 'Buat Random Image'}
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
        <Row gap={1}>
          <Col>
            <Card
              shadow={false}
              css={{
                minHeight: '80vh',
                ...defaultCardStyle,
              }}
            >
              <Grid.Container gap={1} justify="center">
                <Grid xs={6} md={4}>
                  <Card shadow={false} bordered css={defaultCardStyle}>
                    <Text h4>{homeLabels.sidebarTitle}</Text>
                    <Spacer y={2} />
                    <Button.Group css={{ width: '100%', margin: 0 }} color="primary">
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
                    <Spacer y={2} />

                    <Text small>Brand</Text>
                    <Switch
                      title="branding"
                      color="primary"
                      onChange={(e) => {
                        setIsBrandLogo(e.target.checked)
                        setFormData({ ...formData, hasCustomBrandImage: e.target.checked })
                      }}
                    />
                    <Spacer y={2} />
                    {isBrandLogo ? (
                      <ImageUploader
                        label={formData.brand?.meta?.filename || ''}
                        onChange={(img, meta) => setImageFormData('brand', img, meta)}
                      />
                    ) : (
                      <Input
                        clearable
                        labelPlaceholder="Branding Text"
                        color="primary"
                        value={formData.brandingText}
                        onChange={(e) => setValueFormData('brandingText', e.target.value)}
                      />
                    )}

                    <Spacer y={2} />
                    <Button onClick={handleDownload} shadow>
                      Download
                    </Button>
                    <Spacer y={1} />
                    <Button onClick={generateAyat} shadow color="secondary">
                      {loading ? <Loading color="white" size="sm" /> : 'Buat Random Ayat'}
                    </Button>
                    <Card.Footer>
                      <Link
                        color="primary"
                        target="_blank"
                        href="https://github.com/nextui-org/nextui"
                      >
                        Baca tutorial lengkapnya..
                      </Link>
                    </Card.Footer>
                  </Card>
                </Grid>
                <Grid xs={6} md={8}>
                  <Card shadow={false} bordered css={defaultCardStyle}>
                    <canvas
                      id="quote-canvas"
                      width={layoutSize.width}
                      height={layoutSize.height}
                    ></canvas>
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
