export interface AirQuality {
  quality: AirQualityState;
  pm2_5: number;
  pm10: number;
}

export enum AirQualityState {
  UNKNOWN = "UNKNOWN", //0,
  EXCELLENT = "EXCELLENT", //1,
  GOOD = "GOOD", //2,
  FAIR = "FAIR", //3,
  INFERIOR = "INFERIOR", //4,
  POOR = "POOR" //5
}
