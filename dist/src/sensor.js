"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var serialport_1 = require("serialport");
var SerialPort = require("serialport");
var events_1 = require("events");
var models_1 = require("./models");
var TestSerialPort = require('serialport/test');
var AirQualitySensor = /** @class */ (function (_super) {
    __extends(AirQualitySensor, _super);
    function AirQualitySensor() {
        var _this = _super.call(this) || this;
        // Create a mock port and enable the echo and recording.
        var MockBinding = TestSerialPort.Binding;
        MockBinding.createPort('/dev/ROBOT', { echo: true, record: true });
        _this.port = new SerialPort('/dev/ROBOT');
        // Replace the above with just:
        // var port = new SerialPort('/dev/cu.Bluetooth-Incoming-Port', {
        //   baudRate: 9600
        // });
        var parser = new serialport_1.parsers.Readline({ delimiter: "\n", encoding: "utf8" });
        _this.port.pipe(parser);
        parser.on('data', function (data) {
            try {
                var raw = JSON.parse(data.toString());
                _this.emit('data', {
                    pm2_5: raw.pm2_5,
                    pm10: raw.pm10,
                    pc0_3: raw.pc0_3,
                    pc0_5: raw.pc0_5,
                    pc1_0: raw.pc1_0,
                    pc2_5: raw.pc2_5,
                    pc5_0: raw.pc5_0,
                    pc10: raw.pc10,
                    quality: _this.pm2_5ToQuality(raw.pm2_5)
                });
            }
            catch (_a) {
            }
        });
        _this.port.on('error', function (err) {
            console.log('Error: ', err.message);
        });
        return _this;
    }
    AirQualitySensor.prototype.pm2_5ToQuality = function (pm2_5) {
        if (pm2_5 >= 0.0 && pm2_5 < 12.0) {
            return models_1.AirQualityState.EXCELLENT;
        }
        else if (pm2_5 >= 12.0 && pm2_5 < 35.4) {
            return models_1.AirQualityState.GOOD;
        }
        else if (pm2_5 >= 35.4 && pm2_5 < 55.4) {
            return models_1.AirQualityState.FAIR;
        }
        else if (pm2_5 >= 55.4 && pm2_5 < 150.4) {
            return models_1.AirQualityState.POOR;
        }
        else if (pm2_5 >= 150.4) {
            return models_1.AirQualityState.INFERIOR;
        }
        else
            return models_1.AirQualityState.UNKNOWN;
    };
    AirQualitySensor.prototype.generateData = function () {
        var _this = this;
        var pm2_5 = 1;
        var pm10 = 10;
        var up = true;
        // Dummy function to avoid having to attach real hardware
        this.port.write(JSON.stringify({ pm2_5: pm2_5, pm10: pm10 }) + "\n");
        setInterval(function () {
            _this.port.write(JSON.stringify({ pm2_5: pm2_5, pm10: pm10 }) + "\n");
            if (pm2_5 >= 100) {
                up = false;
            }
            else if (pm2_5 < 1) {
                up = true;
            }
            if (up) {
                pm2_5 += 1;
                pm10 += 1;
            }
            else {
                pm2_5 -= 1;
                pm10 -= 1;
            }
        }, 1000);
    };
    return AirQualitySensor;
}(events_1.EventEmitter));
exports.AirQualitySensor = AirQualitySensor;
//# sourceMappingURL=sensor.js.map