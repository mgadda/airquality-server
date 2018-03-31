import { verbose as sqlite, Database, Statement } from "sqlite3";
import { AirQualityState } from "./index";
import { promisify } from "util";

// Set up in-memory db
const sqlite3 = require('sqlite3').verbose();

const createSql = `CREATE TABLE airquality ( 
  id INTEGER PRIMARY KEY AUTOINCREMENT, 
  quality TEXT, 
  pm2_5 INTEGER, 
  pm10 INTEGER, 
  created_at integer(4) not null default (strftime('%s','now')) 
);`

const selectSql = `
SELECT aq.* 
FROM airquality AS aq
ORDER BY datetime(aq.created_at, 'unixepoch', 'localtime')
LIMIT 1;
`;

const insertSql = `
INSERT INTO airquality (quality, pm2_5, pm10) values (?, ?, ?); 
`;

export interface Row { 
  quality: AirQualityState, 
  pm2_5: number, 
  pm10: number 
}

export class AirQualityDatabase {
  db: Database

  constructor() {
    this.db = new sqlite3.Database(':memory:');
    this.db.run(createSql);    
  }

  insert(quality: AirQualityState, pm2_5: number, pm10: number) {
    this.db.serialize(() => {
      const stmt: Statement = this.db.prepare(insertSql);
      stmt.run(quality, pm2_5, pm10);
      stmt.finalize();
    });
  }

  async getLatest(): Promise<Row> {
    //return await promisify(this.db.get)(selectSql) as Row;    
    const selectOp: Promise<Row> = new Promise((resolve, reject) => {
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

