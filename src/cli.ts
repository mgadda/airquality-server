import * as program from "commander"
import { Server } from "./server";


let httpPort: number;

program
  .name("airquality-server")
  .version("0.1.0")
  .option("--verbose", "Be more verbose")
  .option("-p, --port <n>", "port", parseInt)
  .option("--database-path", "Path to sqlite database", "aq.db")
  .option(
    "-s, --sampling-period", 
    "Number of minutes between saving samples to disk", 
    (value) => parseFloat(value) * 60 * 1000, 
    15.0)
  .parse(process.argv);


const server = new Server(
  program.verbose, 
  program.port, 
  program.databasePath, 
  program.samplingPeriod
);

server.run();

