import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html style={
      {
        backgroundColor: '#1d2b2a'
      }
    }>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
