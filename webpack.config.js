const { resolve } = require('path')

module.exports = {
  devtool: '#source-map',
  entry: {
    'nav-corner': './src/nav-corner.js',
  },
  output: {
    path: resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015']
      }
    }]
  }
}
