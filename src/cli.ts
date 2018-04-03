import * as program from "commander"
import { Server } from "./server";


let httpPort: number;

program
  .name("airquality-server")
  .version("0.1.0")
  .option("-v, --verbose", "Be more verbose")
  .option("-p, --port <n>", "port", parseInt, 4000)
  .option("--database-path <s>", "Path to sqlite database", "./aq.db")
  .option("--test-mode", "Generate fake database from fake device /dev/ROBOT")
  .option(
    "-s, --sampling-period <n>", 
    "Number of minutes between saving samples to disk", 
    (value) => parseFloat(value) * 60 * 1000, 
    15.0)
  .option("-d, --device <s>", "Serial device to read from", "/dev/cu.usbmodem1421")
  .parse(process.argv);


const server = new Server(
  program.verbose, 
  program.port, 
  program.databasePath, 
  program.samplingPeriod,
  program.device,
  program.testMode,
);

server.run();

