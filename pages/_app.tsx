import '../styles/globals.css'
import type { AppProps } from 'next/app'
import en from "../lang/en.json";
import ru from "../lang/ru.json";
import { useRouter } from 'next/router';
import { IntlProvider } from 'react-intl';
import { ThemeProvider } from '@emotion/react';
import { darkThemeOptions } from '../themes/dark';
import { Box } from '@mui/material';
import React from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from '../app/sessions';
import { PrismaClient } from '@prisma/client';
import { ThemeContextWrapper } from '../components/GlobalContexts/ThemeContext';
import { Header } from '../app/header';

const messages: { [loc: string]: { [id: string]: string } } = {
  en,
  ru,
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const locale: string = router.locale!

  //dynamic html.lang attribute
  React.useEffect(() => {
    document.documentElement.lang = locale;
  })

  return (
    <IntlProvider locale={locale!} messages={messages[locale]}>
      <ThemeContextWrapper>
        <>
          <Component {...pageProps} />
        </>
      </ThemeContextWrapper>
    </IntlProvider>)

}