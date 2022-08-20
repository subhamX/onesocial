import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { MetaHead } from '../components/MetaHead'
import { ApolloProvider } from '@apollo/client'
import { apolloClient } from '../graphql'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ApolloProvider client={apolloClient}>
        <MetaHead />
        <Component {...pageProps} />
        <div className="text-black">
          <ToastContainer autoClose={1200} />
        </div>
      </ApolloProvider>
    </>
  )
}

export default MyApp
