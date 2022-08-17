import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { MetaHead } from '../components/MetaHead'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <MetaHead />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
