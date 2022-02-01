import type { NextPage } from 'next'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Card, CSS, Grid, Input, Link, Spacer, Switch, Text } from '@nextui-org/react'
import { Container, Row, Col } from '@nextui-org/react'
import { homeLabels } from '../libs/constants'
import { fileMeta } from '../libs/model/shared'
import ImageUploader from '../libs/Component/ImageUploader'
import React from 'react'
import HtmlHead from '../libs/Component/HtmlHead'

const defaultCardStyle: CSS = {
  borderRadius: 0,
}

type quoteConfig = {
  openingText?: string
  primaryText: string
  secondaryText?: string
  author?: string
  brandingText?: string
  brand?: {
    image?: HTMLImageElement
    meta?: fileMeta
  }
  background?: {
    image: HTMLImageElement
    meta: fileMeta
  }
  randomImage?: HTMLImageElement
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
  const [isBrandLogo, setIsBrandLogo] = React.useState(false)
  const [isCustomBg, setIsCustomBg] = React.useState(false)
  const [formData, setFormData] = React.useState<quoteConfig>({ primaryText: '' })

  const setValueFormData = (
    key: 'openingText' | 'primaryText' | 'secondaryText' | 'author' | 'brandingText',
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

  return (
    <>
      <HtmlHead title={homeLabels.pageTitle} description={homeLabels.pageDescription} />
      <Header />
      <Spacer y={1} />
      <Container gap={0}>
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
                  <Card css={defaultCardStyle}>
                    <Text h4>{homeLabels.sidebarTitle}</Text>
                    <Spacer y={2} />
                    <Text small>Background</Text>
                    <Switch
                      title="branding"
                      checked={isCustomBg}
                      size="xl"
                      color="primary"
                      onChange={(e) => setIsCustomBg(e.target.checked)}
                    />
                    <Spacer y={2} />
                    {isCustomBg ? (
                      <ImageUploader
                        label={formData.background?.meta?.filename || ''}
                        onChange={(img, meta) => setImageFormData('background', img, meta)}
                      />
                    ) : (
                      'Random Image'
                    )}
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
                      labelPlaceholder="Primary Text"
                      color="primary"
                      value={formData.primaryText}
                      onChange={(e) => setValueFormData('primaryText', e.target.value)}
                    />
                    <Spacer y={2} />

                    <Input
                      clearable
                      labelPlaceholder="Secondary Text"
                      color="primary"
                      value={formData.secondaryText}
                      onChange={(e) => setValueFormData('secondaryText', e.target.value)}
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
                      checked={isBrandLogo}
                      size="xl"
                      color="primary"
                      onChange={(e) => setIsBrandLogo(e.target.checked)}
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
                    2
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
              <footer className={styles.footer}>
                <a
                  href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Powered by{' '}
                  <span className={styles.logo}>
                    <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
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
