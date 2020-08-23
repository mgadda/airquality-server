import { parsers } from "serialport";
import * as SerialPort from "serialport";
import { EventEmitter } from "events";
import { AirQualityState } from "./models";
const MockBinding = require("serialport/lib/bindings/mock");

export class AirQualitySensor extends EventEmitter {
  port: SerialPort

  pm2_5ToQuality(pm2_5: number): AirQualityState {
    if (pm2_5 >= 0.0 && pm2_5 < 12.0) {
      return AirQualityState.EXCELLENT;
    } else if (pm2_5 >= 12.0 && pm2_5 < 35.4) {
      return AirQualityState.GOOD;
    } else if (pm2_5 >= 35.4 && pm2_5 < 55.4) {
      return AirQualityState.FAIR;
    } else if (pm2_5 >= 55.4 && pm2_5 < 150.4) {
      return AirQualityState.POOR;
    } else if (pm2_5 >= 150.4) {
      return AirQualityState.INFERIOR;
    } else return AirQualityState.UNKNOWN;
  }

  constructor(device: string, testMode: boolean) {
    super();

    if (testMode) {
      // Create a mock port and enable the echo and recording.
      MockBinding.createPort('/dev/ROBOT', { echo: true, record: true })      
      this.port = new SerialPort('/dev/ROBOT', { binding: MockBinding });
    } else {
      this.port = new SerialPort(device, {
        baudRate: 9600
      });
    }

    const parser = new parsers.Readline({delimiter: "\r\n", encoding: "utf8"});
    this.port.pipe(parser);

    parser.on('data', (data) => {
      try {
        const raw = JSON.parse(data.toString());
        this.emit('data', {
          pm2_5: raw.pm2_5,
          pm10: raw.pm10,
          pc0_3: raw.pc0_3,
          pc0_5: raw.pc0_5,
          pc1_0: raw.pc1_0,
          pc2_5: raw.pc2_5,
          pc5_0: raw.pc5_0,
          pc10: raw.pc10,
	        quality: this.pm2_5ToQuality(raw.pm2_5),
	        created_at: new Date().toISOString()
        });
      } catch {
      }
    });

    this.port.on('error', function(err: any) {
      console.log('Error: ', err.message);
    })

  }

  generateData() {
    let pm2_5 = 1;
    let pm10 = 10;
    let up = true;
    // Dummy function to avoid having to attach real hardware
    this.port.write(JSON.stringify({pm2_5, pm10}) + "\r\n");
    setInterval(() => {
      this.port.write(JSON.stringify({pm2_5, pm10}) + "\r\n");
      if (pm2_5 >= 100) {
        up = false;
      } else if (pm2_5 < 1) {
        up = true;
      }
      if (up) {
        pm2_5 += 1;
        pm10 += 1;
      } else {
        pm2_5 -= 1;
        pm10 -= 1;
      }

    }, 1000);
  }
}
