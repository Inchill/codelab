const path = require('path')

module.exports = {
    entry: {
      index: path.join(__dirname, './src/core/index.js')
    },
    output: {
        filename: 'vue.mini.js',
        path: path.join(__dirname, 'dist'),
        library: 'Vue',
        libraryTarget: 'window'
    },
    mode: 'production',
    resolve: {
        extensions: ['.js']
    },
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