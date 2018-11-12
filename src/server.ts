import * as express from "express";
import * as graphqlHTTP from "express-graphql";
import Schema from "./schema";
import { GraphQLError } from "graphql";
import * as morgan from "morgan";
import { AirQualityDatabase } from "./db";
import { AirQualitySensor } from "./sensor";
import { AirQuality, AirQualityState } from "./models";
import * as mustacheExpress from "mustache-express";

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
      async air_quality(): Promise<object> {
        const row = that._getLatest();
        return {
          quality: row.quality,
          particulate2_5: row.pm2_5,
          particulate10: row.pm10,
          particulateCount0_3: row.pc0_3,
          particulateCount0_5: row.pc0_5,
          particulateCount1_0: row.pc1_0,
          particulateCount2_5: row.pc2_5,
          particulateCount5_0: row.pc5_0,
          particulateCount10: row.pc10,
          created_at: row.created_at
        };
      },
      async history({ since }: { since: number }): Promise<Array<object>> {
        // This will probably be slow.
        return that.db.getLatest(since).then((rows) =>         
          rows.map((row: AirQuality) => (
            {
              quality: row.quality,
              particulate2_5: row.pm2_5,
              particulate10: row.pm10,
              particulateCount0_3: row.pc0_3,
              particulateCount0_5: row.pc0_5,
              particulateCount1_0: row.pc1_0,
              particulateCount2_5: row.pc2_5,
              particulateCount5_0: row.pc5_0,
              particulateCount10: row.pc10,
              created_at: row.created_at
            })
          )          
        )
      }
    };

    const app = express();
    
    app.engine('mustache', mustacheExpress());
    app.set('view engine', 'mustache');
    app.set('views', './dist/views');
    
    app.use('/js', express.static('./dist/src/client'));
    
    app.use(morgan("dev"));
    app.use(
      '/graphql',
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
    app.get('/histo', (req, res) => {
      res.render('histo', {});
    })
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

