const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack')

const MODNAME = 'particleLine'

const config = {
  mode: 'development',
  entry: './src/main.ts',
  output: {
    filename: 'particle-line.min.js',
    path: path.resolve(__dirname, 'dist'),
    library: MODNAME,
    libraryExport: 'default',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  devServer: {
    contentBase: './dist',
    hot: true,
    open: 'Chrome'
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules/
    }]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/test.html',
      inject: false,
      minify: {
        collapseWhitespace: true,
        removeEmptyAttributes: true
      },
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
}


module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'inline-source-map'
  }

  if (argv.mode === 'production') {
    //...
  }

  return config
}
