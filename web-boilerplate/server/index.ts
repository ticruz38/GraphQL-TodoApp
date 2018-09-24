import "server/utils/polyfills";
import * as express from "express";
import favicon from "serve-favicon";
import renderer from "server/renderer";
import { aggregateYaml } from "server/utils";

const app = express();

// this is used by kubernetes, for healthcheck
app.get("/liveness", (req, res, next) => res.send("life is good"));

app.use(favicon("static/images/react-boilerplate.png"));

app.use("/dist", express.static("dist"));

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

app.listen(eval(WEB_PORT), WEB_HOST, err => {
  if (err) {
    console.error(err);
  } else {
    console.info(`Listening on host ${WEB_HOST} and port ${WEB_PORT}`);
  }
});
