const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = ({ production } = false) => {
  const config = {
    entry: {
      main: ['whatwg-fetch', 'babel-polyfill', './src/index.js']
    },
    bail: true,
    devtool: 'eval-source-map',
    output: {
      filename: '[name].js',
      publicPath: '',
      path: `${__dirname}/public`
    },
    devServer: {
      inline: true,
      contentBase: './public'
    },
    plugins: [
      new ExtractTextPlugin({
        filename: '[name].css',
        allChunks: true,
        disable: !production
      })
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            { loader: 'babel-loader' },
            { loader: 'eslint-loader' }
          ]
        },
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: 'css-loader?sourceMap&minimize=true'
          })
        },
        {
          test: /\.less$/,
          exclude: /node_modules/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: 'css-loader?sourceMap&minimize=true!postcss-loader?sourceMap!less-loader?sourceMap'
          })
        },
        {
          test: /\.(png|gif|jpe?g)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 1000000
              }
            }
          ]
        }
      ]
    }
  };
  
  if (production) {
    console.log('Webpack: Building for Production\n');
    
    config.devtool = 'source-map';
    config.plugins = config.plugins.concat([
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        compress: {
          warnings: false,
          comparisons: false
        },
        output: {
          comments: false
        }
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ]);
  }
  
  return config;
};
