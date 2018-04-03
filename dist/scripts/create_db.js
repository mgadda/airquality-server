"use strict";
exports.__esModule = true;
var createSql = "CREATE TABLE airquality ( \n  id INTEGER PRIMARY KEY AUTOINCREMENT, \n  quality TEXT, \n  pm2_5 INTEGER, \n  pm2_10 INTEGER, \n  created_at integer(4) not null default (strftime('%s','now')) \n);";
var selectSql = "\nSELECT aq.*, datetime(aq.created_at, 'unixepoch', 'localtime') as utc \nFROM airquality AS aq;\n";
var insertSql = "\nINSERT INTO airquality (quality, pm2_5) values (\"GOOD\", 12); \n";
//# sourceMappingURL=create_db.js.map