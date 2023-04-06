const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = (env) => {
  const style_loader = env.production ? MiniCssExtractPlugin.loader : 'style-loader'
  
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
      port: 5000,
      open: true,
    },
    module: {
      rules: [
        {
          test: /\.html$/i,
          use: ['html-loader']
        },
        {
          test: /\.css$/i,
          use: [style_loader, 'css-loader']
        },
        {
          test: /\.s[ac]ss$/i,
          use: [style_loader, 'css-loader', 'sass-loader']
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html'
      }),
      new MiniCssExtractPlugin({
          filename: 'main.css'
      })
    ]
  }
}