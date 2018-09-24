require("browser-env")();
global["fetch"] = require("node-fetch");
// import * as favicon from "serve-favicon";
require("es6-promise").polyfill();
require("isomorphic-fetch");
