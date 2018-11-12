"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var sqlite3 = require('sqlite3').verbose();
var createSql = "CREATE TABLE IF NOT EXISTS airquality ( \n  id INTEGER PRIMARY KEY AUTOINCREMENT, \n  quality TEXT, \n  pm2_5 INTEGER, \n  pm10 INTEGER, \n  pc0_3 INTEGER,\n  pc0_5 INTEGER,\n  pc1_0 INTEGER,\n  pc2_5 INTEGER,          \n  pc5_0 INTEGER,\n  pc10 INTEGER,\n  created_at integer(4) not null default (strftime('%s','now')) \n);";
// TODO: add index on created_at?
var selectSql = "\nSELECT aq.* \nFROM airquality AS aq\nWHERE created_at >= $since\nORDER BY datetime(aq.created_at, 'unixepoch', 'localtime') DESC;\n";
var insertSql = "\nINSERT INTO airquality \n  (quality, pm2_5, pm10, pc0_3, pc0_5, pc1_0, pc2_5, pc5_0, pc10) \nVALUES (?, ?, ?, ?, ?, ?, ?, ?, ?); \n";
var AirQualityDatabase = /** @class */ (function () {
    function AirQualityDatabase(filename) {
        if (filename === void 0) { filename = ':memory:'; }
        var _this = this;
        this.db = new sqlite3.Database(filename);
        this.db.serialize(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.db.run(createSql);
                this.stmt = this.db.prepare(insertSql);
                return [2 /*return*/];
            });
        }); });
    }
    AirQualityDatabase.prototype.insert = function (airquality) {
        var _this = this;
        this.db.serialize(function () {
            _this.stmt.run(airquality.quality, airquality.pm2_5, airquality.pm10, airquality.pc0_3, airquality.pc0_5, airquality.pc1_0, airquality.pc2_5, airquality.pc5_0, airquality.pc10, function (error) {
                if (error) {
                    console.log(error);
                }
            });
        });
    };
    AirQualityDatabase.prototype.getLatest = function (since) {
        return __awaiter(this, void 0, void 0, function () {
            var selectOp;
            var _this = this;
            return __generator(this, function (_a) {
                //return await promisify(this.db.get)(selectSql) as AirQuality;    
                console.log(since);
                selectOp = new Promise(function (resolve, reject) {
                    _this.db.all(selectSql, { $since: since }, function (err, rows) {
                        if (err) {
                            reject(err);
                        }
                        else {
                            if (!rows) {
                                reject(new Error("something went wrong fetching airquality"));
                            }
                            else {
                                resolve(rows); // TODO: transform row: any into Row
                            }
                        }
                    });
                });
                return [2 /*return*/, selectOp];
            });
        });
    };
    return AirQualityDatabase;
}());
exports.AirQualityDatabase = AirQualityDatabase;
//# sourceMappingURL=db.js.map