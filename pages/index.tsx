import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { Layout } from '../components/Layout/Layout'
import { Navbar } from '../components/Navbar.tsx'

const Home: NextPage = () => {
  return (
    <>

      <div>
        <Navbar/>

      </div>

    </>
  )
}

export default Home
