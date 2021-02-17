const path = require('path');                                 
const HtmlWebpackPlugin = require('html-webpack-plugin');     
const {CleanWebpackPlugin} = require('clean-webpack-plugin'); 

module.exports = {
  entry: {
    main: path.resolve(__dirname, '..', './src/index.js'),
  },
  output: {
    path: path.resolve(__dirname, '..', './dist'),
    filename: '[name].bundle.js',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'webpack Boilerplate',
      template: path.resolve(__dirname, '..', './src/template.html'),
      filename: 'index.html',
    }),
  ],
  module: {
    rules: [
      { // JavaScript
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader'],
      },
      { // Images
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
      },
      { // Fonts and SVGs
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: 'asset/inline',
      },
      { // CSS, PostCSS and Sass
        test: /\.(scss|css)$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
      },
    ],
  },
}

