/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'ru'],
    defaultLocale: 'ru',
  },
  experimental: {
    appDir: true
  }
}

const withPlugins = require('next-compose-plugins')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: process.env.ANALYZE === 'true',

})

module.exports = withPlugins([
  [withBundleAnalyzer],
  nextConfig
])
