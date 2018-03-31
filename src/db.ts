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

const selectSql = `
SELECT aq.* 
FROM airquality AS aq
ORDER BY datetime(aq.created_at, 'unixepoch', 'localtime') DESC
LIMIT 1;
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

  async getLatest(): Promise<AirQuality> {
    //return await promisify(this.db.get)(selectSql) as AirQuality;    
    const selectOp: Promise<AirQuality> = new Promise((resolve, reject) => {
      this.db.get(selectSql, (err: Error | null, row: any) => {
        if (err) {
          reject(err);
        } else {
          if (!row) {
            reject(new Error("no rows returned"));
          } else {
            resolve(row); // TODO: transform row: any into Row
          }          
        }        
      });
    }); 

    return selectOp;    
  }  
}

