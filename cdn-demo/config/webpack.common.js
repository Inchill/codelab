const path = require('path');
const vueLoaderPlugin = require('vue-loader/lib/plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: path.join(__dirname, '../src/index.js')
  },
  output: {
    filename: '[name]-[hash:6].js',
    path: path.join(__dirname, './dist')
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: path.join(__dirname, '../src/assets/index.html'),
        chunks: ['index']
    }),
    new vueLoaderPlugin()
  ],
  externals: {
    'vue': 'Vue',
    'at-ui': 'at'
  },
  resolve: {
    extensions: ['.js']
  }
}