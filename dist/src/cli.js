"use strict";
exports.__esModule = true;
var program = require("commander");
var server_1 = require("./server");
var httpPort;
program
    .name("airquality-server")
    .version("0.1.0")
    .option("-v, --verbose", "Be more verbose")
    .option("-p, --port <n>", "port", parseInt, 4000)
    .option("--database-path <s>", "Path to sqlite database", "./aq.db")
    .option("--test-mode", "Generate fake database from fake device /dev/ROBOT")
    .option("-s, --sampling-period <n>", "Number of minutes between saving samples to disk", function (value) { return parseFloat(value) * 60 * 1000; }, 15.0)
    .option("-d, --device <s>", "Serial device to read from", "/dev/cu.usbmodem1421")
    .parse(process.argv);
var server = new server_1.Server(program.verbose, program.port, program.databasePath, program.samplingPeriod, program.device, program.testMode);
server.run();
//# sourceMappingURL=cli.js.map