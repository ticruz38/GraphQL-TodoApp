global["window"] = { location: {} };
global["fetch"] = require("node-fetch");
import * as express from "express";
import * as cors from "cors";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { execute, subscribe } from "graphql";

import graph from "graph";
import session from "session";
import schema from "schema";
import { generateTypes } from "utils";

const app = express();

// kubernetes healthcheck
app.get("/liveness", (req, res, next) => res.send("all right buddy"));

app.use(cors());

app.use(session);

// app.use("*", (req, res, next) => {
//   if (!PRODUCTION) {
//     generateTypes();
//     return next();
//   }
//   next();
// });

app.use(graph);

const server = app.listen(eval(GRAPH_PORT) || 8082, GRAPH_HOST, err => {
  if (err) {
    console.error(err);
  } else {
    console.info(`Listening on host ${GRAPH_HOST} and port ${GRAPH_PORT || 8082}`);
  }
});
new SubscriptionServer(
  {
    execute,
    schema,
    subscribe
  },
  {
    server,
    path: "/socket"
  }
);
