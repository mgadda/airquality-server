import { verbose as sqlite, Database, Statement } from "sqlite3";
import { promisify } from "util";
import { AirQuality, AirQualityState } from "./models";
import { create } from "domain";

const sqlite3 = require('sqlite3').verbose();

const createSql = `CREATE TABLE IF NOT EXISTS airquality ( 
  id INTEGER PRIMARY KEY AUTOINCREMENT, 
  quality TEXT, 
  pm2_5 INTEGER, 
  pm10 INTEGER, 
  pc0_3 INTEGER,
  pc0_5 INTEGER,
  pc1_0 INTEGER,
  pc2_5 INTEGER,          
  pc5_0 INTEGER,
  pc10 INTEGER,
  created_at integer(4) not null default (strftime('%s','now')) 
);`

// TODO: add index on created_at?
const selectSql = `
SELECT 
  id,
  quality,
  pm2_5,
  pm10,
  pc0_3,
  pc0_5,
  pc1_0,
  pc2_5,
  pc5_0,
  pc10,
  aq.created_at * 1000 as created_at //, datetime(created_at, 'unixepoch') as created_at2
FROM airquality AS aq
WHERE created_at >= $since and created_at < $until
ORDER BY datetime(aq.created_at, 'unixepoch', 'localtime') DESC;
`;

const insertSql = `
INSERT INTO airquality 
  (quality, pm2_5, pm10, pc0_3, pc0_5, pc1_0, pc2_5, pc5_0, pc10) 
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?); 
`;

export class AirQualityDatabase {
  db: Database
  stmt: Statement
  constructor(filename: string = ':memory:') {
    this.db = new sqlite3.Database(filename);
    this.db.serialize(async () => {
      this.db.run(createSql);    
      this.stmt = this.db.prepare(insertSql);      
    });    
  }

  insert(airquality: AirQuality) {
    this.db.serialize(() => {      
      this.stmt.run(
        airquality.quality, airquality.pm2_5, airquality.pm10,
        airquality.pc0_3, airquality.pc0_5, airquality.pc1_0,
        airquality.pc2_5, airquality.pc5_0, airquality.pc10,
        function (error: any) {
        if (error) {
          console.log(error);
        }
      });      
    });
  }

  async getLatest(since: number, until: number): Promise<AirQuality[]> {
	  if (until < 0 || since < 0) {
	  throw "Invalid start or end time";
	  }
    //return await promisify(this.db.get)(selectSql) as AirQuality;    
    console.log(since, until);
    const selectOp: Promise<AirQuality[]> = new Promise((resolve, reject) => {      
      this.db.all(selectSql, { $since: since, $until: until }, (err: Error | null, rows: any[]) => {
        if (err) {
          reject(err);
        } else {
          if (!rows) {
            reject(new Error("something went wrong fetching airquality"));
          } else {
            resolve(rows); // TODO: transform row: any into Row
          }          
        }        
      });
    }); 

    return selectOp;    
  }  
}

