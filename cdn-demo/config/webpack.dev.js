const common = require('./webpack.common');
const { merge } = require('webpack-merge');

module.exports = merge(common, {
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    port: 8081,
    hot: true
  }
})