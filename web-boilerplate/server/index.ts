global["window"] = { location: {} };
global["fetch"] = require("node-fetch");

import * as express from "express";
import * as http from "http";
import * as httpProxy from "http-proxy";
// import * as favicon from "serve-favicon";
import renderer from "server/renderer";
import session from "server/session";
import { aggregateYaml, generateTypes } from "server/utils";

require("es6-promise").polyfill();
require("isomorphic-fetch");

export const proxy = httpProxy.createProxyServer({
  target: GRAPHQL_SERVER_URL
});

const app = express();
const proxyApp = http.createServer(app);

// aggregateYaml();

// this is used by kubernetes, for healthcheck
app.get("/liveness", (req, res, next) => res.send("life is good"));

// app.use(favicon("server/public/bell-icon.ico"));

app.use("/dist", express.static("dist"));

app.post("/graphql", (req, res) => {
  proxy.web(req, res, { target: GRAPHQL_SERVER_URL });
});

app.use("/socket", (req, res) => {
  proxy.web(req, res, { target: GRAPHQL_SERVER_URL + "/socket" });
});

app.use("*", (req, res, next) => {
  if (!PRODUCTION) {
    aggregateYaml();
    return next();
  }
  next();
});

// app.use("*", (req, res, next) => {
//   if (!PRODUCTION) {
//     generateTypes();
//     return next();
//   }
//   next();
// });

app.get("*", renderer);

proxyApp.on("upgrade", (req, socket, head) => proxy.ws(req, socket, head));

// Listen for the `error` event on `proxy`.
proxyApp.on("error", function(err, req, res) {
  console.log(err);
  res.send(500);
});

// Listen for the `close` event on `proxy`.
proxyApp.on("close", function(res, socket, head) {
  console.log("Client disconnected");
});

proxyApp.listen(eval(WEB_PORT), WEB_HOST, err => {
  if (err) {
    console.error(err);
  } else {
    console.info(`Listening on host ${WEB_HOST} and port ${WEB_PORT}`);
  }
});
