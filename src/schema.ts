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
}

type Query {
  airQuality: AirQuality
}
`);
