import Head from 'next/head'
import styles from '../styles/index/indexpage.module.css';
import { useIntl } from 'react-intl'
import React from 'react'
import { Box, Container, Paper, Typography, useTheme } from '@mui/material'
import ThreadsListPage from './threads/main';
export default function Home(props:{user:number}) {

  const intl = useIntl();

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        123
      </Container>
    </>
  )
}