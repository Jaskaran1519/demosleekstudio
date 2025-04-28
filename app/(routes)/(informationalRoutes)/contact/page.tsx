import { Container } from '@/components/ui/container'
import React from 'react'
import ContactPage from './ContactPage'
import Head from 'next/head'

const page = () => {
  return (
    <>
        <Head>
            <title>Contact Us - Sleek Studio</title>
            <meta name="description" content="Get in touch with Sleek Studio. Call us, message us on WhatsApp, or find our location." />
        </Head>
        <Container>
            <ContactPage/>
        </Container>
    </>
  )
}

export default page