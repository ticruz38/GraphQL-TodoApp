import * as fs from "fs";
import * as glob from "glob";

import { buildASTSchema, graphql, parse } from "graphql";
import { introspectionQuery } from "graphql/utilities";
import { generate } from "graphql-code-generator";

export default async function() {
  const typeDefs = glob
    .sync("schema/**/*.gql")
    .map(f => fs.readFileSync(f, "utf8"))
    .join();
  await introspect(typeDefs);
  generate({
    template: "graphql-codegen-typescript-template",
    schema: process.cwd() + "/dist/schema.json",
    out: process.cwd() + "/graphql-typings.d.ts",
    overwrite: true
    // args: [process.cwd() + "/app/**/*.{ts,tsx}"]
  });
}

const introspect = async function(typeDefs: string) {
  const schema = buildASTSchema(parse(typeDefs));
  const result = await graphql(schema, introspectionQuery);
  if (result.errors) {
    return console.error(`Errors in introspection query result: ${result.errors}`);
  }
  fs.writeFileSync("dist/schema.json", JSON.stringify(result, null, 2));
};
