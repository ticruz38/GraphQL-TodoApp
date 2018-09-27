import * as glob from "glob";
import * as fs from "fs";
import Any from "graphql-type-json";
import Subscription from "./subscriptions";
import Query from "./queries";
import Mutation from "./mutations";
// import * as Types from "./types";
import { default as auth } from "./directives/AuthDirective";

import { makeExecutableSchema } from "graphql-tools";

const typeDefs = glob
  .sync("schema/**/*.gql")
  .map(f => fs.readFileSync(f, "utf8"))
  .join();


export default makeExecutableSchema({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
    Subscription,
    Any
    // ...Types
  },
  schemaDirectives: {
    auth
  }
});
