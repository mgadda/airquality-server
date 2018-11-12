"use strict";
exports.__esModule = true;
var graphql_1 = require("graphql");
exports["default"] = graphql_1.buildSchema("enum Quality {\n  UNKNOWN\n  EXCELLENT\n  GOOD\n  FAIR\n  INFERIOR\n  POOR\n}\n\ntype AirQuality {\n  quality: Quality\n  particulate2_5: Int\n  particulate10: Int\n  particulateCount0_3: Int\n  particulateCount0_5: Int\n  particulateCount1_0: Int\n  particulateCount2_5: Int\n  particulateCount5_0: Int\n  particulateCount10: Int\n  created_at: Int\n}\n\ntype Query {\n  air_quality: AirQuality\n  history(since: Int): [AirQuality]\n}\n");
//# sourceMappingURL=schema.js.map