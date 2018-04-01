"use strict";
exports.__esModule = true;
var program = require("commander");
var server_1 = require("./server");
var httpPort;
program
    .name("airquality-server")
    .version("0.1.0")
    .option("--verbose", "Be more verbose")
    .option("-p, --port <n>", "port", parseInt)
    .option("--database-path", "Path to sqlite database", "aq.db")
    .option("-s, --sampling-period", "Number of minutes between saving samples to disk", function (value) { return parseFloat(value) * 60 * 1000; }, 15.0)
    .parse(process.argv);
var server = new server_1.Server(program.verbose, program.port, program.databasePath, program.samplingPeriod);
server.run();
//# sourceMappingURL=cli.js.map