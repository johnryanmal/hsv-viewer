import MiniCssExtractPlugin from 'mini-css-extract-plugin'

export default (env) => {
  const style_loader =
    env.production
      ? MiniCssExtractPlugin.loader
      : 'style-loader'

  return {
    mode: 'development',
    entry: './src/index.js',
    output: {
      filename: 'main.js',
      publicPath: 'dist'
    },
    module: {
      rules: [
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
      new MiniCssExtractPlugin({
          filename: 'main.css'
      })
    ]
  }
}