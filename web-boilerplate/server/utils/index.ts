import * as glob from "glob";
import * as fs from "fs";
import { buildASTSchema, graphql, parse } from "graphql";
import { introspectionQuery } from "graphql/utilities";
import { generate } from "graphql-code-generator";

export function aggregateYaml() {
  const tradFile = glob
    .sync("src/**/*.intl")
    .map(f => fs.readFileSync(f, "utf8"))
    .join("\r\n");
  if (tradFile == fs.readFileSync("i18n/en.yaml")) return;
  fs.writeFileSync("i18n/en.yaml", tradFile);
}

export function generateTypes() {
  generate({
    template: "graphql-codegen-typescript-template",
    schema: "http://localhost:2222",
    // schema: process.cwd() + "/dist/schema.json",
    out: process.cwd() + "/graphql-typings.d.ts",
    overwrite: true,
    args: [process.cwd() + "/src/**/*.{ts,tsx}"]
  });
}
