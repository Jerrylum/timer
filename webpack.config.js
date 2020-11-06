const MinifyHtmlWebpackPlugin = require('minify-html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');


var path = require('path')
var webpack = require('webpack')

module.exports = {
    entry: ['./src/script/index.js'],
    output: {
        path: path.join(__dirname, 'dist/static'),
        filename: 'bundle.js'
    },
    plugins: [
        new MinifyHtmlWebpackPlugin({
            src: 'src/html',
            dest: 'dist',
            rules: {
                collapseBooleanAttributes: true,
                collapseWhitespace: true,
                removeComments: true,
            }
        }),
        new MiniCssExtractPlugin({
            filename: 'bundle.css'
        })
    ],
    module: {
        rules: [{
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: { presets: ['@babel/preset-env'] }
                }
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            }
        ]
    },
    optimization: {
        minimizer: [
            new CssMinimizerPlugin(),
        ],
    }

}