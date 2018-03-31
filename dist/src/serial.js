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
var TestSerialPort = require('serialport/test');
var AirQualitySensor = /** @class */ (function (_super) {
    __extends(AirQualitySensor, _super);
    function AirQualitySensor() {
        var _this = _super.call(this) || this;
        // Create a port and enable the echo and recording.
        var MockBinding = TestSerialPort.Binding;
        MockBinding.createPort('/dev/ROBOT', { echo: true, record: true });
        var port = new SerialPort('/dev/ROBOT');
        // var port = new SerialPort('/dev/tty-usbserial1', {
        //   baudRate: 9600
        // });
        var parser = new serialport_1.parsers.Readline({ delimiter: "\n", encoding: "utf8" });
        port.pipe(parser);
        parser.on('data', function (data) {
            _this.emit('data', JSON.parse(data.toString()));
        });
        port.on('error', function (err) {
            console.log('Error: ', err.message);
        });
        return _this;
    }
    AirQualitySensor.prototype.generateData = function () {
        var _this = this;
        // Dummy function to avoid having to attach real hardware
        this.port.write(JSON.stringify({ a: 10, b: 20 }) + "\n");
        setTimeout(function () {
            _this.port.write(JSON.stringify({ a: 10, b: 20 }) + "\n");
        }, 1000);
    };
    return AirQualitySensor;
}(events_1.EventEmitter));
exports.AirQualitySensor = AirQualitySensor;
// (function wait () {
//   if (true) setTimeout(wait, 1000);
// })();
//# sourceMappingURL=serial.js.map