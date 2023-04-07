const path = require('path')
const autoprefixer = require('autoprefixer')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = (env) => {
  const style_loader = env.production ? MiniCssExtractPlugin.loader : 'style-loader'
  const postcss_loader = {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: () => [autoprefixer]
      }
    }
  }

  const dist = path.resolve(__dirname, 'dist')

  return {
    mode: env.production ? 'production' : 'development',
    entry: './src/index.js',
    output: {
      filename: 'main.js',
      path: dist
    },
    devServer: {
      static: {
        directory: dist
      },
      port: 8080,
      open: true,
    },
    stats: {
      loggingDebug: ['sass-loader'],
    },
    module: {
      rules: [
        {
          test: /\.html$/i,
          use: ['html-loader']
        },
        {
          test: /\.css$/i,
          use: [style_loader, 'css-loader', postcss_loader]
        },
        {
          test: /\.s[ac]ss$/i,
          use: [style_loader, 'css-loader', postcss_loader, 'sass-loader']
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: './src/index.html'
      }),
      new MiniCssExtractPlugin({
        filename: 'main.css'
      })
    ]
  }
}