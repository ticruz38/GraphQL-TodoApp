import { graphqlExpress } from "apollo-server-express";
import * as bodyParser from "body-parser";
import { Router } from "express";

import schema from "schema";
import { Db, defaultTodo, defaultUser } from "utils/testDb";

const graphql = Router();

const db = new Db(defaultTodo, defaultUser);
graphql.use(
  "/",
  bodyParser.json(),
  graphqlExpress(req => {
    return {
      schema,
      graphiql: true,
      context: {
        db,
        session: req["session"]
      }
    };
  })
);

export type Context = {
  token: string;
  session: any;
  db: Db;
};

export default graphql;
