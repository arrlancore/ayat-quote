import Head from 'next/head'
import { htmlHeadConfig } from '../model/shared'

const HtmlHead = (props: htmlHeadConfig) => {
  return (
    <Head>
      <title>{props.title}</title>
      <meta name="description" content={props.description} />
      <link rel="icon" href={props.faviconUrl || '/favicon.ico'} />
    </Head>
  )
}

export default HtmlHead
