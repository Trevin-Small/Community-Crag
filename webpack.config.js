const path = require('path');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        library: 'communityCrag',
        
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