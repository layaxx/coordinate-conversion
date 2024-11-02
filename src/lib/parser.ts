import {
  DecimalDegrees,
  degreesToDecimalDegrees,
  EXIF,
  NMEA,
  NMEAToDecimalDegrees,
} from "./conversion"
import {
  validateDecimalDegrees,
  validateDegrees,
  validateNMEA,
} from "./validation"
import { reportError } from "./utils"
import { toast } from "react-toastify"

type ParserResponse =
  | undefined
  | { type: "exif"; value: EXIF }
  | { type: "nmea"; value: NMEA }
  | { type: "kml"; value: DecimalDegrees }

export function generalInput(input: string): ParserResponse {
  input = input.trim()
  let count = 0
  while (input.includes("‐") && count < 10) {
    input = input.replace("‐", "-")

    count++
  }

  let match
  if ((match = input.match(/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*$/))) {
    const newKML: DecimalDegrees = [
      Number.parseFloat(match[1]),
      Number.parseFloat(match[2]),
    ]

    const validationResponse = validateDecimalDegrees(newKML)

    if (!validationResponse.success) {
      reportError(validationResponse.error)
      return
    }

    console.log("KML detected")
    return { type: "kml", value: newKML }
  }

  if (
    (match = input.match(
      /^(\d+\.?\d*)\s*,\s*(N|S)\s*,\s*(\d+\.?\d*)\s*,\s*(W|E)\s*$/
    ))
  ) {
    if (!["N", "S"].includes(match[2]) || !["W", "E"].includes(match[4])) {
      reportError("Failed to parse NMEA")
      return undefined
    }
    const newNMEA: NMEA = [
      [Number.parseFloat(match[1]), match[2] as "N" | "S"],
      [Number.parseFloat(match[3]), match[4] as "W" | "E"],
    ]

    const validationResponse = validateNMEA(newNMEA)

    if (!validationResponse.success) {
      reportError(validationResponse.error)
      return
    }

    console.log("NMEA detected")
    return { type: "nmea", value: newNMEA }
  }

  if (
    (match = input.match(
      /^\s*(\d+\s*;\s*)(\d+\s*;\s*)(\d+\.?\d*\s*)(\d+\s*;\s*)(\d+\s*;\s*)(\d+\.?\d*\s*)$/
    ))
  ) {
    const newEXIF: EXIF = [
      [match[1], match[2], match[3]]
        .map((string) => string.replace(";", ""))
        .map((string, index) =>
          index === 2 ? Number.parseFloat(string) : Number.parseInt(string, 10)
        ),
      [match[4], match[5], match[6]]
        .map((string) => string.replace(";", ""))
        .map((string, index) =>
          index === 2 ? Number.parseFloat(string) : Number.parseInt(string, 10)
        ),
    ] as EXIF

    const validationResponse = validateDegrees(newEXIF)

    if (!validationResponse.success) {
      reportError(validationResponse.error)
      return
    }

    console.log("EXIF detected")
    return { type: "exif", value: newEXIF }
  }

  if (
    (match = input.match(
      /^(N|S)?(\d+)°?\s+(\d+)'?\s+(\d+\.?\d*)"?\s+(E|W)?(\d+)°?\s+(\d+)'?\s+(\d+\.?\d*)"?\s*$/
    ))
  ) {
    const [_, latDir, latD, latM, latS, longDir, longD, longM, longS] = match

    const newEXIF: EXIF = [
      [
        (latDir === "S" ? -1 : 1) * Number.parseInt(latD, 10),
        Number.parseInt(latM, 10),
        Number.parseFloat(latS),
      ],
      [
        (longDir === "W" ? -1 : 1) * Number.parseInt(longD, 10),
        Number.parseInt(longM, 10),
        Number.parseFloat(longS),
      ],
    ] as EXIF

    const validationResponse = validateDegrees(newEXIF)

    if (!validationResponse.success) {
      reportError(validationResponse.error)
      return
    }

    console.log("EXIF detected")
    return { type: "exif", value: newEXIF }
  }

  if (
    (match = input.match(
      /^(N|S)(\d+)°?\s+(\d+\.?\d*)\s+(E|W)(\d+)°?\s+(\d+\.?\d*)\s*$/
    ))
  ) {
    const [_, latDir, latD, latM, longDir, longD, longM] = match

    const newNMEA: NMEA = [
      [Number.parseInt(latD) * 100 + Number.parseFloat(latM), latDir],
      [Number.parseInt(longD) * 100 + Number.parseFloat(longM), longDir],
    ] as NMEA

    const validationResponse = validateNMEA(newNMEA)

    if (!validationResponse.success) {
      reportError(validationResponse.error)
      return
    }

    console.log("NMEA detected")
    return { type: "nmea", value: newNMEA }
  }

  console.warn("unknown format")
  toast.warn("unknown format", {
    updateId: "warn",
    toastId: "warn",
    autoClose: 1000,
  })
  return undefined
}

export function parseAsKML(input: string): DecimalDegrees | undefined {
  const parserResponse = generalInput(input)

  if (parserResponse) {
    switch (parserResponse.type) {
      case "exif":
        return degreesToDecimalDegrees(parserResponse.value)
      case "kml":
        return parserResponse.value
      case "nmea":
        return NMEAToDecimalDegrees(parserResponse.value)
    }
  }

  return undefined
}
