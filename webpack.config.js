const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
// const { VueLoaderPlugin } = require('./src')

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: './example/main.js',
  devServer: {
    // compress: true,
    port: 3000,
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ["@babel/preset-env"]
            }
          }
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
        // loader: path.resolve(__dirname, 'src')
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: true
    })
  ]
}