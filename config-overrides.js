const webpack = require('webpack');

module.exports = function override(config) {
  // Add fallbacks for node modules
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "assert": require.resolve("assert"),
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "os": require.resolve("os-browserify"),
    "path": require.resolve("path-browserify"),
    "url": require.resolve("url"),
    "buffer": require.resolve("buffer"),
    "process": require.resolve("process/browser"),
    "fs": false,
    "util": require.resolve("util"),
    "zlib": require.resolve("browserify-zlib")
  });
  config.resolve.fallback = fallback;

  // Add plugins
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    }),
    new webpack.NormalModuleReplacementPlugin(/node:/, (resource) => {
      const mod = resource.request.replace(/^node:/, "");
      switch (mod) {
        case "buffer":
          resource.request = "buffer";
          break;
        case "stream":
          resource.request = "readable-stream";
          break;
        default:
          throw new Error(`Not found ${mod}`);
      }
    })
  ]);

  // Ignore source map warnings
  config.ignoreWarnings = [/Failed to parse source map/];

  return config;
}; 