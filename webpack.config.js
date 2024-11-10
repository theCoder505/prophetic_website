const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'production', // For production optimizations
  entry: './src/index.js', // Your entry file
  output: {
    path: path.resolve(__dirname, 'build'), // Change output to 'build'
    filename: 'bundle.[contenthash].js', // Unique hash for caching
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Transpile JS/JSX using Babel
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'], // For handling CSS files with PostCSS
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new CleanWebpackPlugin(), // Cleans the 'build' folder before each build
    new HtmlWebpackPlugin({
      template: './public/index.html', // Points to your HTML template
      filename: 'index.html',
    }),
  ],
  devServer: {
    contentBase: path.resolve(__dirname, 'build'),
    compress: true,
    port: 3000,
  },
};
