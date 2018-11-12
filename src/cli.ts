import * as program from "commander"
import { Server } from "./server";
import { readFileSync, readFile } from "fs";
import { promisify } from "util";

export async function main(): Promise<void> {
  let httpPort: number;

  program
    .name("airquality-server")
    .version("0.1.0")    
    .option("-v, --verbose", "Be more verbose", false)
    .option("-p, --port <n>", "port", parseInt, 4000)
    .option("--database-path <s>", "Path to sqlite database", "./aq.db")
    .option("--test-mode", "Generate fake database from fake device /dev/ROBOT")
    .option(
      "-s, --sampling-period <n>", 
      "Number of milliseconds between saving samples to disk", 
      (value: string) => parseFloat(value), 
      900000.0)
    .option("-d, --device <s>", "Serial device to read from")
    .option("--config <s>", "Path to json config file")
    .parse(process.argv);

  if (!process.argv.slice(2).length) {
    program.help();
  }
  
  let server: Server;

  if (program.config) {
    const file = await promisify(readFile)(program.config);
    const config = JSON.parse(file.toString());
    
    if (!config) {
      throw new Error("Malformed config: " + program.config);
    } else if (!config.device) {
      throw new Error("`device` is a required property");
    }

    server = new Server(
      config.verbose || false, 
      config.port || 4000, 
      config.databasePath || "./aq.db", 
      config.samplingPeriod || 900000,
      config.device,
      config.testMode || false,
    );

  } else {
    server = new Server(
      program.verbose, 
      program.port, 
      program.databasePath, 
      program.samplingPeriod,
      program.device,
      program.testMode,
    );
  }

  server.run();
}

main().catch((error) => { 
  console.log(error.message);
  process.exit(1);
});
