const merge = require("webpack-merge");
const webpack = require("webpack");
const path = require("path");
const dotenv = require("dotenv");
const config = require("./config.js");

dotenv.config();

module.exports = merge(
  {
    target: "web",
    entry: {
      app: path.resolve("./src/index.tsx"),
      vendors: config.vendors
    },
    plugins: [
      ...config.plugins,
      new webpack.optimize.CommonsChunkPlugin({
        name: "vendors",
        minChunks: Infinity,
        filename: "[name].js"
      })
    ],
    devServer: {
      historyApiFallback: true,
      port: process.env.STATIC_PORT,
      host: process.env.STATIC_HOST,
      publicPath: "/",
      contentBase: "/dist/",
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    }
  },
  config.common
);
