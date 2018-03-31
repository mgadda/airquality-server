"use strict";
exports.__esModule = true;
var graphql_1 = require("graphql");
exports["default"] = graphql_1.buildSchema("enum Quality {\n  UNKNOWN\n  EXCELLENT\n  GOOD\n  FAIR\n  INFERIOR\n  POOR\n}\n\ntype AirQuality {\n  quality: Quality\n  particulate2_5: Int\n  particulate10: Int\n}\n\ntype Query {\n  airQuality: AirQuality\n}\n");
//# sourceMappingURL=schema.js.map