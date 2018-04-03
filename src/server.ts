import * as express from "express";
import * as graphqlHTTP from "express-graphql";
import Schema from "./schema";
import { GraphQLError } from "graphql";
import * as morgan from "morgan";
import { AirQualityDatabase } from "./db";
import { AirQualitySensor } from "./sensor";
import { AirQuality, AirQualityState } from "./models";

export class Server {
  sensor: AirQualitySensor;
  db: AirQualityDatabase;
  verbose: boolean;
  samplingPeriod: number; // milliseconds
  lastSample: AirQuality;
  testMode: boolean;

  constructor(
    verbose: boolean,
    port: number,
    dbPath: string,
    samplingPeriod: number,
    device: string,
    testMode: boolean,
  ) {
    this.sensor = new AirQualitySensor(device, testMode);
    if (testMode) {
      this.sensor.generateData();
    }

    this.db = new AirQualityDatabase(dbPath);
    this.verbose = verbose;
    this.samplingPeriod = samplingPeriod;
    this.testMode = testMode;
  }

  run() {
    this.sensor.on("data", this._handleSensorData.bind(this));
    setInterval(this._recordSample.bind(this), this.samplingPeriod);

    let that = this;
    const root = {
      airQuality: {
        async quality(): Promise<string> {
          const row = that._getLatest();
          return row.quality;
        },
        async particulate2_5() {
          const row = that._getLatest();
          return row.pm2_5;
        },
        async particulate10() {
          const row = that._getLatest();
          return row.pm10;
        }
      }
    };

    const app = express();
    app.use(morgan("dev"));
    app.use(
      graphqlHTTP({
        schema: Schema,
        rootValue: root,
        graphiql: true,
        pretty: true,
        formatError: (error: GraphQLError) => ({
          message: error.message,
          locations: error.locations,
          stack: error.stack ? error.stack.split("\n") : [],
          path: error.path
        })
      })
    );
    app.listen(4000);
  }

  _getLatest(): AirQuality {
    return this.lastSample;
  }

  _recordSample() {
    if (this.lastSample) {
      this.db.insert(this.lastSample);
    }
    
    if (this.verbose && this.lastSample) {
      console.log(this.lastSample);
    }
  }

  _handleSensorData(airQuality: AirQuality) {
    this.lastSample = airQuality;
  }
}

// setInterval(db.insert, 900000, lastSample); // every 15 minutes

// db.insert({ quality: AirQualityState.GOOD, pm2_5: 1, pm10: 1 });
// sensor.generateData();

