const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  entry: {
    index: path.resolve(__dirname, '../src/index.tsx')
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]-[chunkhash:6].js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: 'ts-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, './public/index.html')
    }),
    new CleanWebpackPlugin()
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json']
  }
}