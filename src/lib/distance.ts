import { DecimalDegrees } from "./conversion"

export function distance(p1: DecimalDegrees, p2: DecimalDegrees): number {
  const [lat1, long1] = p1.map((degree) => (degree * Math.PI) / 180)
  const [lat2, long2] = p2.map((degree) => (degree * Math.PI) / 180)
  const deltaLat = lat2 - lat1
  const deltaLong = long2 - long1
  const a =
    Math.pow(Math.sin(deltaLat / 2), 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLong / 2), 2)
  const R = 6_371_000
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}
