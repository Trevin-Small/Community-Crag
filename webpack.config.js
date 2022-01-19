const path = require('path');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = {
    mode: 'development',
    entry: ['./src/index.js', './src/mainFunctions.js', './src/listeners.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    watch: true,
    plugins: [
        new NodePolyfillPlugin()
    ],
    resolve: {
        fallback: {
          fs: false
        }
      }
}