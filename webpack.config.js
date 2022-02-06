const path = require('path');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

// Host
const host = process.env.HOST || 'localhost';

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    watch: true,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        library: 'communityCrag',

    },
    plugins: [
        new NodePolyfillPlugin()
    ],
    resolve: {
      fallback: {
        fs: false
      }
    },
    devServer: {
      // Serve index.html as the base
      static: './dist',
      // Enable compression
      compress: true,
      // Enable hot reloading
      hot: true,
      host,
      port: 8000,
      allowedHosts: ['communitycrag.com',],
    }
}