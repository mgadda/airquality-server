import * as express from "express";
import * as graphqlHTTP from 'express-graphql';
import Schema from './schema';
import { GraphQLError } from "graphql";
import * as morgan from "morgan";
import { AirQualityDatabase } from "./db";

// TODO: Setup serialport

export enum AirQualityState {
  UNKNOWN = "UNKNOWN", //0,
  EXCELLENT = "EXCELLENT", //1,
  GOOD = "GOOD", //2,
  FAIR = "FAIR", //3,
  INFERIOR = "INFERIOR", //4,
  POOR = "POOR" //5
}

const db = new AirQualityDatabase();
db.insert(AirQualityState.POOR, 80, 150);

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