import { expect, test } from "vitest"
import { decimalDegreesData, degreesData, NMEAData } from "./conversion.data"
import {
  validateDecimalDegrees,
  validateDegrees,
  validateNMEA,
} from "./validation"
import { DecimalDegrees, Degrees, NMEA } from "./conversion"

test.each(NMEAData)(
  "valid NMEA coordinates are correctly validated",
  (...input) => {
    expect(validateNMEA(input).success).toBe(true)
  }
)

test("invalid NMEA coordinates (wrong direction) are rejected", () => {
  expect(
    validateNMEA([
      [12.2, "W"],
      [12.3, "E"],
    ] as unknown as NMEA).success
  ).toBe(false)

  expect(
    validateNMEA([
      [12.2, "N"],
      [12.3, "S"],
    ] as unknown as NMEA).success
  ).toBe(false)
})

test("invalid NMEA coordinates incorrect numbers are rejected", () => {
  expect(
    validateNMEA([
      [-12.2, "N"],
      [12.3, "E"],
    ]).success
  ).toBe(false)

  expect(
    validateNMEA([
      [12.2, "S"],
      [-12.3, "E"],
    ]).success
  ).toBe(false)

  expect(
    validateNMEA([
      [238887.2, "S"],
      [12.3, "E"],
    ]).success
  ).toBe(false)

  expect(
    validateNMEA([
      [Number.NaN, "S"],
      [12.3, "E"],
    ]).success
  ).toBe(false)
})

test("invalid NMEA coordinates (wrong structure) are rejected", () => {
  expect(
    validateNMEA([
      [12, 12, 2],
      [12, 23, 3.4],
    ] as unknown as NMEA).success
  ).toBe(false)

  expect(validateNMEA([[12, "N"]] as unknown as NMEA).success).toBe(false)
})

test.each(degreesData)(
  "valid degree coordinates are correctly validated",
  (...input) => {
    expect(validateDegrees(input).success).toBe(true)
  }
)

test("invalid degree coordinates are rejected", () => {
  expect(validateDegrees([[18, 23, 23.23]] as unknown as Degrees).success).toBe(
    false
  )

  expect(
    validateDegrees([
      [18, -23, 23.23],
      [18, 23, 23.23],
    ] as unknown as Degrees).success
  ).toBe(false)

  expect(
    validateDegrees([
      [18, 23, 23.23],
      [18, 23, -23.23],
    ] as unknown as Degrees).success
  ).toBe(false)

  expect(
    validateDegrees([
      [91, 23, 23.23],
      [18, 23, 23.23],
    ] as unknown as Degrees).success
  ).toBe(false)

  expect(
    validateDegrees([
      [18, 23, 23.23],
      [-181, 23, 23.23],
    ] as unknown as Degrees).success
  ).toBe(false)
})

test.each(decimalDegreesData)(
  "valid decimal degree coordinates are correctly validated",
  (...input) => {
    expect(validateDecimalDegrees(input).success).toBe(true)
  }
)

test("invalid decimal degree coordinates are rejected", () => {
  expect(
    validateDecimalDegrees([12.2, "W"] as unknown as DecimalDegrees).success
  ).toBe(false)

  expect(
    validateDecimalDegrees([-92.2, 1] as unknown as DecimalDegrees).success
  ).toBe(false)

  expect(
    validateDecimalDegrees([91, 23] as unknown as DecimalDegrees).success
  ).toBe(false)

  expect(
    validateDecimalDegrees([2, 181] as unknown as DecimalDegrees).success
  ).toBe(false)
  expect(
    validateDecimalDegrees([89, -181] as unknown as DecimalDegrees).success
  ).toBe(false)
})
