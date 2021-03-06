const webpack = require('webpack')
const fs = require('fs')
const { resolve, join } = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const { getIfUtils, removeEmpty } = require('webpack-config-utils')
const { ifProduction, ifNotProduction } = getIfUtils(process.env.NODE_ENV)
const nodeModules = {}

fs.readdirSync('node_modules')
  .filter(file => !file.includes('.bin'))
  .forEach((module) => {
    nodeModules[module] = `commonjs ${ module }`
  })

const baseConfig = {
  mode: ifProduction('production', 'development'),
  output: {
    path: resolve('static'),
    chunkFilename: ifProduction('scripts/[name].chunk.js?v=[chunkhash]', 'scripts/[name].chunk.js')
  },
  resolve: {
    modules: [
      resolve('shared'),
      resolve('browser'),
      resolve('server'),
      'node_modules'
    ],
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    mainFiles: ['index', 'index.web'],
    alias: {
      'react-dom': '@hot-loader/react-dom'
    }
  },
  stats: {
    colors: true,
    reasons: true,
    chunks: false
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        exclude: resolve(__dirname, 'node_modules')
      },
      /* {
       *   test: /\.tsx?$/,
       *   loader: 'tslint-loader',
       *   enforce: 'pre',
       *   exclude: resolve(__dirname, 'node_modules')
       * }, */
      {
        test: /\.(t|j)sx?$/,
        exclude: [
          resolve(__dirname, 'node_modules'),
          resolve(__dirname, 'resources', 'scripts'),
        ],
        use: [
          {
            loader: 'babel-loader',
            query: {
              babelrc: false,
              presets: [
                ['@babel/env', { loose: true, modules: false }],
                '@babel/react'
              ],
              plugins: [
                '@babel/plugin-syntax-dynamic-import',
                '@babel/plugin-proposal-class-properties',
                ["@babel/plugin-proposal-decorators", { legacy: true }],
                "@babel/plugin-transform-runtime",
                'react-hot-loader/babel'
              ]
            }
          },
          {
            loader: 'ts-loader'
          }
        ]
      },
      {
        test: /\.css$/,
        include: resolve(__dirname, 'shared'),
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: ifProduction(false, true),
              reloadAll: true,
            }
          },
          {
            loader: 'css-loader',
            query: {
              minimize: true,
              modules: true,
              sourceMap: true,
              importLoaders: 1,
              localIdentName: '[local]_[hash:base64:5]'
            }
          },
          {
            loader: 'postcss-loader'
          }
        ]
      },
      {
        test: /\.css$/,
        exclude: resolve(__dirname, 'shared'),
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: ifProduction(false, true),
              reloadAll: true,
            }
          },
          {
            loader: 'css-loader',
            query: { minimize: true }
          }
        ]
      },
      {
        test: /\.(ttf|eot|otf|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        include: resolve(__dirname, 'shared', 'resources', 'fonts'),
        loader: 'url-loader',
        options: {
          ...(process.env.TARGET !== 'electron-renderer' ? { limit: 1024 } : null),
          name: 'fonts/[name].[ext]'
        }
      },
      {
        test: /\.(ico|png|jpg|svg|gif)$/,
        include: resolve(__dirname, 'shared', 'resources', 'images'),
        loader: 'url-loader',
        options: {
          ...(process.env.TARGET !== 'electron-renderer' ? { limit: 10240 } : null),
          name: 'images/[name].[ext]?v=[hash:base64:5]'
        }
      }
    ]
  },
  plugins: removeEmpty([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production'),
        APP_ENV: JSON.stringify(process.env.APP_ENV || 'production')
      }
    }),
    new webpack.NormalModuleReplacementPlugin(/.\/production/, `./${process.env.APP_ENV}.json`),
    new MiniCssExtractPlugin({
      filename: ifProduction('styles/bundle.css?v=[hash]', 'styles/bundle.css'),
      chunkFilename: ifProduction('styles/[name].chunk.css?v=[chunkhash]', 'styles/[name].chunk.css')
    }),
    new CopyWebpackPlugin([
      {
        from: join(__dirname, 'shared/resources/scripts'),
        to: join(__dirname, 'static/scripts')
      }
    ], { copyUnmodified: true })
  ])
}

const browserConfig = {
  ...baseConfig,
  context: resolve('browser'),
  entry: ifNotProduction([
    'react-hot-loader/patch',
    './index.tsx'
  ], './index.tsx'),
  output: {
    ...baseConfig.output,
    filename: ifProduction('scripts/bundle.js?v=[hash]', 'scripts/bundle.js'),
    publicPath: '/'
  },
  plugins: removeEmpty([
    ...baseConfig.plugins,
    ifNotProduction(new webpack.HotModuleReplacementPlugin()),
    ifProduction(new webpack.NormalModuleReplacementPlugin(/routes\/sync/, 'routes/async')),
    ifProduction(new ManifestPlugin({ isChunk: true })),
    new HtmlWebpackPlugin({
      inject: false,
      minify: { collapseWhitespace: true },
      template: 'index.html',
      appMountId: 'app',
      mobile: true
    })
  ]),
  devServer: {
    contentBase: './browser',
    hot: true
  }
}

const serverConfig = {
  ...baseConfig,
  target: 'node',
  context: resolve('server'),
  devtool: false,
  entry: './index.js',
  output: {
    ...baseConfig.output,
    filename: 'app.js',
    libraryTarget: 'commonjs2',
    publicPath: '/'
  },
  externals: nodeModules,
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false
  },
  plugins: [
    ...baseConfig.plugins,
    new webpack.ExtendedAPIPlugin()
  ]
}

const configs = {
  web: browserConfig,
  node: serverConfig
}

module.exports = configs[process.env.TARGET]
