import { expect, test } from "vitest"
import {
  NMEAToDecimalDegrees,
  decimalDegreesToDegrees,
  degreesToDecimalDegrees,
  degreesToNMEA,
  decimalDegreesToNMEA,
  NMEAToDegrees,
} from "./conversion"
import {
  decimalDegreesData,
  decimalDegreesToNMEAData,
  degreesData,
  NMEAData,
} from "./conversion.data"

test.each(decimalDegreesToNMEAData)("KML to NMEA works", (input, expected) => {
  const [[lat, latDir], [long, longDir]] = decimalDegreesToNMEA(input)

  const [[latExpected, latDirExpected], [longExpected, longDirExpected]] =
    expected

  expect(latDir).toEqual(latDirExpected)
  expect(longDir).toEqual(longDirExpected)
  expect(lat).toBeCloseTo(latExpected, 3)
  expect(long).toBeCloseTo(longExpected, 3)
})

test.each(decimalDegreesToNMEAData)("NMEA to KML works", (expected, input) => {
  const [lat, long] = NMEAToDecimalDegrees(input)

  const [latExpected, longExpected] = expected

  expect(lat).toBeCloseTo(latExpected, 3)
  expect(long).toBeCloseTo(longExpected, 3)
})

test.each(NMEAData)("nmea => degrees => nmea is original", (...input) => {
  const degrees = NMEAToDegrees(input)
  const [[lat, latDir], [long, longDir]] = degreesToNMEA(degrees)

  const [[latExpected, latDirExpected], [longExpected, longDirExpected]] = input

  expect(latDir).toEqual(latDirExpected)
  expect(longDir).toEqual(longDirExpected)
  expect(lat).toBeCloseTo(latExpected, 3)
  expect(long).toBeCloseTo(longExpected, 3)
})

test.each(NMEAData)("nmea => decimal => nmea is original", (...input) => {
  const decimal = NMEAToDecimalDegrees(input)
  const [[lat, latDir], [long, longDir]] = decimalDegreesToNMEA(decimal)

  const [[latExpected, latDirExpected], [longExpected, longDirExpected]] = input

  expect(latDir).toEqual(latDirExpected)
  expect(longDir).toEqual(longDirExpected)
  expect(lat).toBeCloseTo(latExpected, 3)
  expect(long).toBeCloseTo(longExpected, 3)
})

test.each(decimalDegreesData)(
  "decimal => nmea => decimal is original",
  (...input) => {
    const nmea = decimalDegreesToNMEA(input)
    const [lat, long] = NMEAToDecimalDegrees(nmea)

    const [latExpected, longExpected] = input

    expect(lat).toBeCloseTo(latExpected, 3)
    expect(long).toBeCloseTo(longExpected, 3)
  }
)

test.each(decimalDegreesData)(
  "decimal => degrees => decimal is original",
  (...input) => {
    const degrees = decimalDegreesToDegrees(input)
    const [lat, long] = degreesToDecimalDegrees(degrees)

    const [latExpected, longExpected] = input

    expect(lat).toBeCloseTo(latExpected, 3)
    expect(long).toBeCloseTo(longExpected, 3)
  }
)

test.each(degreesData)("degrees => nmea => degrees is original", (...input) => {
  const nmea = degreesToNMEA(input)
  const [[latD, latM, latS], [longD, longM, longS]] = NMEAToDegrees(nmea)

  const [
    [latDExpected, latMExpected, latSExpected],
    [longDExpected, longMExpected, longSExpected],
  ] = input

  expect(latD).toBe(latDExpected)
  expect(latM).toBe(latMExpected)
  expect(latS).toBeCloseTo(latSExpected, 3)
  expect(longD).toBe(longDExpected)
  expect(longM).toBe(longMExpected)
  expect(longS).toBeCloseTo(longSExpected, 3)
})

test.each(degreesData)(
  "degrees => decimal => degrees is original",
  (...input) => {
    const decimal = degreesToDecimalDegrees(input)
    const [[latD, latM, latS], [longD, longM, longS]] =
      decimalDegreesToDegrees(decimal)

    const [
      [latDExpected, latMExpected, latSExpected],
      [longDExpected, longMExpected, longSExpected],
    ] = input

    expect(latD).toBe(latDExpected)
    expect(latM).toBe(latMExpected)
    expect(latS).toBeCloseTo(latSExpected, 3)
    expect(longD).toBe(longDExpected)
    expect(longM).toBe(longMExpected)
    expect(longS).toBeCloseTo(longSExpected, 3)
  }
)
