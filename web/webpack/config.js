const webpack = require("webpack");
const path = require("path");

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const dotenv = require("dotenv");

const env = process.env.NODE_ENV || "dev";
const isProd = env !== "dev";

dotenv.config();

const rules = [
  {
    test: /\.(tsx|ts)$/,
    exclude: /node_modules/,
    loaders: ["ts-loader"]
  },
  {
    test: /\.(graphql|gql)$/,
    exclude: /node_modules/,
    loader: "graphql-tag/loader"
  },
  {
    test: /\.scss|sass|css$/,
    loader: ExtractTextPlugin.extract({
      fallback: "style-loader",
      use: ["css-loader", isProd ? "postcss-loader" : null, "sass-loader"].filter(s => !!s)
    })
  },
  {
    test: /\.less$/,
    loader: ExtractTextPlugin.extract({
      fallback: "style-loader",
      use: [
        {
          loader: "css-loader"
        },
        {
          loader: "less-loader",
          options: {
            javascriptEnabled: true
          }
        }
      ]
    })
  },
  {
    test: /\.(png|woff|woff2|eot|ttf|svg|gif)$/,
    loader: "file-loader"
  },
  {
    test: /\.yaml$/,
    exclude: /node_modules/,
    use: [{ loader: "json-loader" }, { loader: "yaml-flat-loader" }]
  }
];

exports.rules = rules;

const alias = {
  src: path.resolve("./src"),
  utils: path.resolve("./utils"),
  server: path.resolve("./server"),
  config: path.resolve("./config"),
  i18n: path.resolve("i18n"),
  static: path.resolve("static")
};

const vendors = [
  "react",
  "react-dom",
  "moment",
  "lodash",
  "react-bootstrap",
  "react-redux",
  "react-router",
  "react-router-dom",
  "react-select",
  "redux",
  "redux-logger",
  "classnames",
  "axios",
  "apollo-client",
  "apollo-link"
];

exports.vendors = vendors;

const plugins = [
  new ExtractTextPlugin({ filename: "[name].css", disable: !isProd }),
  isProd ? null : new webpack.HotModuleReplacementPlugin(),
  isProd ? null : new webpack.NamedModulesPlugin(),
  new webpack.DefinePlugin({
    PRODUCTION: !!isProd,
    WEB_HOST: JSON.stringify(process.env.WEB_HOST),
    WEB_PORT: JSON.stringify(process.env.WEB_PORT),
    WEB_URL: JSON.stringify(process.env.WEB_URL),
    HTTP_GRAPHQL_URL: JSON.stringify(process.env.HTTP_GRAPHQL_URL),
    WS_GRAPHQL_URL: JSON.stringify(process.env.WS_GRAPHQL_URL),
    GRAPHQL_SERVER_URL: JSON.stringify(process.env.GRAPHQL_SERVER_URL),
    STATIC_URL: JSON.stringify(process.env.STATIC_URL)
  })
];

exports.plugins = plugins;

exports.common = {
  devtool: !!isProd ? "eval" : "source-map",
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    modules: ["node_modules"],
    alias
  },
  output: {
    path: path.resolve(__dirname, "../dist"),
    publicPath: "/dist/",
    filename: "[name].js"
  },
  module: {
    rules
  }
};
