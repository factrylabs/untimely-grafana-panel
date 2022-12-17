const LiveReloadPlugin = require('webpack-livereload-plugin');

module.exports.getWebpackConfig = (config) => ({
  ...config,
  plugins: [...config.plugins, new LiveReloadPlugin()],
});
