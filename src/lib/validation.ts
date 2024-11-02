import { z } from "zod"
import { DecimalDegrees, Degrees, NMEA } from "./conversion"

const nmeaSchema = z.tuple([
  z.tuple([
    z
      .number()
      .min(0)
      .max(91 * 100),
    z.enum(["N", "S"]),
  ]),
  z.tuple([
    z
      .number()
      .min(0)
      .max(181 * 100),
    z.enum(["E", "W"]),
  ]),
])

export function validateNMEA(input: NMEA) {
  return nmeaSchema.safeParse(input)
}

const decimalDegreeSchema = z.tuple([
  z.number().min(-90).max(90),
  z.number().min(-180).max(180),
])

export function validateDecimalDegrees(input: DecimalDegrees) {
  return decimalDegreeSchema.safeParse(input)
}

const degreesSchema = z.tuple([
  z.tuple([
    z.number().int().min(-90).max(90),
    z.number().int().min(0).max(60),
    z.number().min(0).max(60),
  ]),
  z.tuple([
    z.number().int().min(-180).max(180),
    z.number().int().min(0).max(60),
    z.number().min(0).max(60),
  ]),
])

export function validateDegrees(input: Degrees) {
  return degreesSchema.safeParse(input)
}
