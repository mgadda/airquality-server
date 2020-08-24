export interface AirQuality {
  quality: AirQualityState;
  pm2_5: number;
  pm10: number;
  pc0_3?: number;
  pc0_5?: number;
  pc1_0?: number;
  pc2_5?: number;
  pc5_0?: number;
  pc10?: number;
  created_at_iso: string;
  created_at_ms: string;
}

export enum AirQualityState {
  UNKNOWN = "UNKNOWN", //0,
  EXCELLENT = "EXCELLENT", //1,
  GOOD = "GOOD", //2,
  FAIR = "FAIR", //3,
  INFERIOR = "INFERIOR", //4,
  POOR = "POOR" //5
}
