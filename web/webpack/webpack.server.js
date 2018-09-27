const merge = require("webpack-merge");
const path = require("path");
const webpack = require("webpack");
const config = require("./config.js");

const isProd = process.env.NODE_ENV !== "dev";

module.exports = merge(
  {
    target: "node",
    entry: {
      web: path.resolve("./server/index.ts")
    },
    watch: isProd ? false : true,
    plugins: [
      ...config.plugins,
      new webpack.BannerPlugin({
        banner: 'require("source-map-support").install();',
        raw: true,
        entryOnly: false
      })
    ]
  },
  config.common
);
