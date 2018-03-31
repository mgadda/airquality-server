import * as express from "express";
import * as graphqlHTTP from 'express-graphql';
import Schema from './schema';
import { GraphQLError } from "graphql";
import * as morgan from "morgan";
import { AirQualityDatabase } from "./db";
import { AirQualitySensor } from "./sensor";
import { AirQuality, AirQualityState } from "./models";

// TODO: Setup serialport
const sensor = new AirQualitySensor();
const db = new AirQualityDatabase("aq.db");

sensor.on('data', (airQuality: AirQuality) => {
  db.insert(airQuality);
});

// db.insert({ quality: AirQualityState.GOOD, pm2_5: 1, pm10: 1 });
// sensor.generateData();

const root = {
  airQuality: {
    async quality(): Promise<string> {
      const row = await db.getLatest();
      return row.quality;      
    },
    async particulate2_5() {
      const row = await db.getLatest();
      return row.pm2_5;      
    },
    async particulate10() {
      const row = await db.getLatest();
      return row.pm10;      
    },
  }
}

const app = express();
app.use(morgan("dev"));
app.use(graphqlHTTP({
  schema: Schema,
  rootValue: root,
  graphiql: true,
  pretty: true,    
  formatError: (error: GraphQLError) => ({
    message: error.message,
    locations: error.locations,
    stack: error.stack ? error.stack.split('\n') : [],
    path: error.path
  }),
}));

app.listen(4000);