import * as path from 'path'
// import * as webpack from 'webpack'

export default {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    index: path.join(__dirname, 'src', 'App.tsx'),
  },
  output: {
    filename: '[name].bundle.js',
    path: path.join(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
}
