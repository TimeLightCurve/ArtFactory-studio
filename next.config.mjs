/** @type {import('next').NextConfig} */

import { createRequire } from 'module'

// Create a require function
const require = createRequire(import.meta.url)

const nextConfig = {
  // uncomment the following snippet if using styled components
  // compiler: {
  //   styledComponents: true,
  // },
  images: {},
  webpack(config, { isServer }) {
    if (!isServer) {
      // We're in the browser build, so we can safely exclude the sharp module
      config.externals.push('sharp')
    }
    // audio support
    config.module.rules.push({
      test: /\.(ogg|mp3|wav|mpe?g)$/i,
      exclude: config.exclude,
      use: [
        {
          loader: require.resolve('url-loader'),
          options: {
            limit: config.inlineImageLimit,
            fallback: require.resolve('file-loader'),
            publicPath: `${config.assetPrefix}/_next/static/images/`,
            outputPath: `${isServer ? '../' : ''}static/images/`,
            name: '[name]-[hash].[ext]',
            esModule: config.esModule || false,
          },
        },
      ],
    })
    // config.module.rules.push({
    //   test: /\.(glsl|vs|fs|vert|frag)$/,
    //   exclude: /node_modules/,
    //   use: ['ts-shader-loader', 'webpack-lygia-loader'],
    // })
      config.module.rules.push({
        test: /\.(glsl|vs|fs|vert|frag)$/,
        exclude: /node_modules/,
        use: ['raw-loader', 'glslify-loader', 'webpack-lygia-loader'],
      })

    return config
  },
}

export default nextConfig
