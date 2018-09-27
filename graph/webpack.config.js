var path = require("path");
var nodeExternals = require("webpack-node-externals");
var webpack = require("webpack");
const dotenv = require("dotenv");

const env = process.env.NODE_ENV || "dev";
const isProd = env !== "dev";

dotenv.config();

const plugins = [
  new webpack.DefinePlugin({
    PRODUCTION: !!isProd,
    GRAPH_PORT: JSON.stringify(process.env.GRAPH_PORT),
    GRAPH_HOST: JSON.stringify(process.env.GRAPH_HOST)
  }),
  new webpack.BannerPlugin({
    banner: 'require("source-map-support").install();',
    raw: true,
    entryOnly: false
  })
];

const alias = {
  config: path.resolve("./config"),
  utils: path.resolve("./utils"),
  session: path.resolve("./session"),
  schema: path.resolve("./schema"),
  graph: path.resolve("./graph"),
  "subscription-endpoint": path.resolve("./subscription-endpoint")
};

module.exports = {
  entry: {
    graph: path.resolve("./index.ts")
  },
  devtool: isProd ? "cheap-module-source-map" : "source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
    modules: ["node_modules"],
    alias
  },
  output: {
    path: path.resolve("./dist"),
    filename: "[name].js"
  },
  watch: !isProd,
  externals: [nodeExternals()],

  target: "node",

  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
      {
        test: /\.(tsx|ts|jsx|js)$/,
        exclude: /node_modules|graph\/dist/,
        loader: ["ts-loader"]
      },
      {
        test: /\.json$/,
        exclude: /node_modules/,
        use: [{ loader: "json-loader" }]
      }
      // {
      //   test: /\.(graphql|gql)$/,
      //   exclude: /node_modules/,
      //   loader: "graphql-tag/loader"
      // }
    ]
  },
  plugins
};
