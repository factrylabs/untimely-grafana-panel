const LiveReloadPlugin = require('webpack-livereload-plugin');

module.exports.getWebpackConfig = (config) => ({
  ...config,
  devtool: false,
  optimization: {
    ...config.optimization,
    concatenateModules: false,
  },
  output: {
    ...config.output,
    hashFunction: 'sha256',
  },
  plugins: [...config.plugins, new LiveReloadPlugin()],
});
