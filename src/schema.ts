import { buildSchema } from "graphql";

export default buildSchema(`enum Quality {
  UNKNOWN
  EXCELLENT
  GOOD
  FAIR
  INFERIOR
  POOR
}

type AirQuality {
  quality: Quality
  particulate2_5: Int
  particulate10: Int
  particulateCount0_3: Int
  particulateCount0_5: Int
  particulateCount1_0: Int
  particulateCount2_5: Int
  particulateCount5_0: Int
  particulateCount10: Int
}

type Query {
  airQuality: AirQuality
  history(since: Int): [AirQuality]
}
`);
