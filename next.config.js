const withPlugins = require('next-compose-plugins')
const typescript = require('@zeit/next-typescript')
const withCSS = require('@zeit/next-css')
const offline = require('next-offline')
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

const plugins = [
  withCSS,
  typescript,
  [offline, ['!', PHASE_DEVELOPMENT_SERVER]]
]

const config = {
  publicRuntimeConfig: {
    isDev: process.env.NODE_ENV !== 'production'
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.(png|jpg|gif|svg|eot|ttf|otf|woff|woff2)$/,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 10000
          }
        }
      ]
    })

    return config
  }
}

module.exports = withPlugins(plugins, config)
