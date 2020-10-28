const path = require('path')

module.exports = {
  entry: {
    index: path.join(__dirname, './src/index.js')
  },
  output: {
    filename: 'bscroll.mini.js',
    path: path.join(__dirname, './lib'),
    library: 'BScroll',
    libraryTarget: 'window'
  },
  mode: 'production',
  module: {
    rules: [
      // 处理ES6转ES5
      {
        test: /\.js$/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env'],
                plugins: [
                    '@babel/plugin-transform-runtime',
                    '@babel/plugin-transform-modules-commonjs'
                ]
            }
        },
        exclude: /node_modules/
      }
    ]
  }
}