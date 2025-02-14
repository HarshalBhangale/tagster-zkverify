const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    process: false,
    zlib: require.resolve("browserify-zlib"),
    stream: require.resolve("stream-browserify"),
    util: require.resolve("util"),
    buffer: require.resolve("buffer"),
    asset: require.resolve("assert"),
    fs: false,
    os: require.resolve("os-browserify/browser"),
    path: require.resolve("path-browserify"),
    crypto: require.resolve("crypto-browserify"),
    vm: require.resolve("vm-browserify")
  };

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer']
    })
  ]);

  // Ignore source map warnings
  config.ignoreWarnings = [/Failed to parse source map/];

  return config;
}; 