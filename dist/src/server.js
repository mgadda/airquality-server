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
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
var express = require("express");
var graphqlHTTP = require("express-graphql");
var schema_1 = require("./schema");
var morgan = require("morgan");
var db_1 = require("./db");
var sensor_1 = require("./sensor");
var Server = /** @class */ (function () {
    function Server(verbose, port, dbPath, samplingPeriod, device, testMode) {
        this.sensor = new sensor_1.AirQualitySensor(device, testMode);
        if (testMode) {
            this.sensor.generateData();
        }
        this.db = new db_1.AirQualityDatabase(dbPath);
        this.verbose = verbose;
        this.samplingPeriod = samplingPeriod;
        this.testMode = testMode;
    }
    Server.prototype.run = function () {
        this.sensor.on("data", this._handleSensorData.bind(this));
        setInterval(this._recordSample.bind(this), this.samplingPeriod);
        var that = this;
        var root = {
            airQuality: function () {
                return __awaiter(this, void 0, void 0, function () {
                    var row;
                    return __generator(this, function (_a) {
                        row = that._getLatest();
                        return [2 /*return*/, {
                                quality: row.quality,
                                particulate2_5: row.pm2_5,
                                particulate10: row.pm10,
                                particulateCount0_3: row.pc0_3,
                                particulateCount0_5: row.pc0_5,
                                particulateCount1_0: row.pc1_0,
                                particulateCount2_5: row.pc2_5,
                                particulateCount5_0: row.pc5_0,
                                particulateCount10: row.pc10
                            }];
                    });
                });
            }
        };
        var app = express();
        app.use(morgan("dev"));
        app.use(graphqlHTTP({
            schema: schema_1["default"],
            rootValue: root,
            graphiql: true,
            pretty: true,
            formatError: function (error) { return ({
                message: error.message,
                locations: error.locations,
                stack: error.stack ? error.stack.split("\n") : [],
                path: error.path
            }); }
        }));
        app.listen(4000);
    };
    Server.prototype._getLatest = function () {
        return this.lastSample;
    };
    Server.prototype._recordSample = function () {
        if (this.lastSample) {
            this.db.insert(this.lastSample);
        }
        if (this.verbose && this.lastSample) {
            console.log(this.lastSample);
        }
    };
    Server.prototype._handleSensorData = function (airQuality) {
        this.lastSample = airQuality;
    };
    return Server;
}());
exports.Server = Server;
// setInterval(db.insert, 900000, lastSample); // every 15 minutes
// db.insert({ quality: AirQualityState.GOOD, pm2_5: 1, pm10: 1 });
// sensor.generateData();
//# sourceMappingURL=server.js.map