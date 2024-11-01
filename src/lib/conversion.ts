export type DecimalDegrees = [number, number]
export type Degrees = [[number, number, number], [number, number, number]]
export type NMEA = [[number, "N" | "S"], [number, "E" | "W"]]
export type EXIF = Degrees

export function degreesToDecimalDegrees(input: Degrees): DecimalDegrees {
  // dd = d + m/60 + s/3600

  const [[latD, latM, latS], [longD, longM, longS]] = input

  return [
    Math.sign(latD) * (Math.abs(latD) + latM / 60 + latS / 3600),
    Math.sign(longD) * (Math.abs(longD) + longM / 60 + longS / 3600),
  ]
}

export function decimalDegreesToDegrees(input: DecimalDegrees): Degrees {
  let [lat, long] = input

  const latD = Math.trunc(lat)
  const longD = Math.trunc(long)

  lat -= latD
  long -= longD

  lat = Math.abs(lat) * 60
  long = Math.abs(long) * 60

  const latM = Math.trunc(lat)
  const longM = Math.trunc(long)

  lat -= latM
  lat *= 60
  long -= longM
  long *= 60

  const latS = lat
  const longS = long

  return [
    [latD, latM, latS],
    [longD, longM, longS],
  ]
}

export function degreesToNMEA(input: Degrees): NMEA {
  const [[latD, latM, latS], [longD, longM, longS]] = input

  const newLat = Math.abs(latD) * 100 + Math.abs(latM) + Math.abs(latS) / 60

  const newLong = Math.abs(longD) * 100 + Math.abs(longM) + Math.abs(longS) / 60

  return [
    [Math.abs(newLat), latD > 0 ? "N" : "S"],
    [Math.abs(newLong), longD > 0 ? "E" : "W"],
  ]
}

export function NMEAToDegrees(input: NMEA): Degrees {
  let [[lat, latDir], [long, longDir]] = input

  const latD = Math.trunc(lat / 100) * (latDir === "S" ? -1 : 1)
  const longD = Math.trunc(long / 100) * (longDir === "W" ? -1 : 1)

  lat %= 100
  long %= 100

  const latM = Math.trunc(lat)
  const longM = Math.trunc(long)

  lat -= latM
  lat *= 60
  long -= longM
  long *= 60

  const latS = lat
  const longS = long

  return [
    [latD, latM, latS],
    [longD, longM, longS],
  ]
}

export function decimalDegreesToNMEA(input: DecimalDegrees): NMEA {
  const [lat, long] = input

  let latResult = Math.abs(Math.trunc(lat)) * 100
  latResult += (Math.abs(lat) % 1) * 60

  let longResult = Math.abs(Math.trunc(long)) * 100
  longResult += (Math.abs(long) % 1) * 60

  return [
    [latResult, lat < 0 ? "S" : "N"],
    [longResult, long < 0 ? "W" : "E"],
  ]
}

export function NMEAToDecimalDegrees(input: NMEA): DecimalDegrees {
  const [[lat, latDir], [long, longDir]] = input

  let latResult = Math.trunc(lat / 100)
  latResult += (lat % 100) / 60
  if (latDir === "S") latResult *= -1

  let longResult = Math.trunc(long / 100)
  longResult += (long % 100) / 60
  if (longDir === "W") longResult *= -1

  return [latResult, longResult]
}
