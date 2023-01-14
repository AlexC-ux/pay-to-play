import '../styles/globals.css'
import type { AppProps } from 'next/app'
import en from "../lang/en.json";
import ru from "../lang/ru.json";
import { useRouter } from 'next/router';
import { IntlProvider } from 'react-intl';
import { ThemeProvider } from '@emotion/react';
import { darkThemeOptions } from '../themes/dark';
import { GlobalContextWrapper } from '../contextes/globalcontext';
import { Box } from '@mui/material';
import Header from '../components/header';
import Footer from '../components/footer';
import React from 'react';

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
      <GlobalContextWrapper>
        <Box
          sx={{
            bgcolor: 'background.default'
          }}>
          <Header />
          <Component {...pageProps} />
          <Footer />
        </Box>
      </GlobalContextWrapper >

    </IntlProvider>)

}
