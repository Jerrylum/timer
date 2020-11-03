var path = require('path')
var webpack = require('webpack')

module.exports = {
    entry: ['./src/index.js'],
    output: {
        path: path.join(__dirname, 'dist/script'),
        filename: 'bundle.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: {
                loader: 'babel-loader',
                options: { presets: ['@babel/preset-env'] }
            }
        }]
    }

}