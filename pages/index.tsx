import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/index/indexpage.module.css';
import { useIntl } from 'react-intl'
import { GlobalContext } from '../contextes/globalcontext'
import React from 'react'
import { Box, Container, Paper, Typography, useTheme } from '@mui/material'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const intl = useIntl();

  const globalContext = React.useContext(GlobalContext)

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>

        <Typography align='center'
          variant='h3'
          sx={{
            my: 2,
          }}>{intl.formatMessage({ id: "INDEX.title.1" })}</Typography>

        <Box sx={{
          width: "100%",
          mx: "auto",
          mt: 5,
          mb: -10,
        }}>
          <Image src="/steam/steam_v1.png" className={styles.heigerOnHover1} alt="steam image" width={600} height={300}/>
        </Box>
        <Box
          sx={{
            mt: "-30px",
            backgroundColor: globalContext?.theme[0].palette.getContrastText(""),
          }}>
          <Typography
            align='center'
            variant='h3'
            sx={{
              color: globalContext?.theme[0].palette.primary.dark,
              mb: 2,
              pt: 10,
            }} >{intl.formatMessage({ id: "INDEX.title.2" })}</Typography>
        </Box>
      </Container>
    </>
  )
}
