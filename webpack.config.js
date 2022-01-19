const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    watch: true,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        library: 'communityCrag',
        libraryTarget: 'umd',
        libraryExport: 'default',
    },
    module: {
      rules: [
        {
          test: /\.(js)$/,
          exclude: /node_modules/,
          use: "babel-loader",
        },
      ],
    },
    resolve: {
        fallback: {
          fs: false
        }
      }
}