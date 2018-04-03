import { verbose } from "sqlite3";

const createSql = `CREATE TABLE airquality ( 
  id INTEGER PRIMARY KEY AUTOINCREMENT, 
  quality TEXT, 
  pm2_5 INTEGER, 
  pm2_10 INTEGER, 
  created_at integer(4) not null default (strftime('%s','now')) 
);`

const selectSql = `
SELECT aq.*, datetime(aq.created_at, 'unixepoch', 'localtime') as utc 
FROM airquality AS aq;
`;

const insertSql = `
INSERT INTO airquality (quality, pm2_5) values ("GOOD", 12); 
`;


