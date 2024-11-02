import { DecimalDegrees, EXIF, NMEA } from "./conversion"

type ParserResponse =
  | undefined
  | { type: "exif"; value: EXIF }
  | { type: "nmea"; value: NMEA }
  | { type: "kml"; value: DecimalDegrees }

export function generalInput(input: string): ParserResponse {
  let match
  if ((match = input.match(/^(\d+\.\d+)\s*,\s*(\d+\.\d+)\s*$/))) {
    const newKML: DecimalDegrees = [
      Number.parseFloat(match[1]),
      Number.parseFloat(match[2]),
    ]

    console.log("KML detected")
    return { type: "kml", value: newKML }
  }

  if (
    (match = input.match(
      /^(\d+\.\d+)\s*,\s*(N|S)\s*,\s*(\d+\.\d+)\s*,\s*(W|E)\s*$/
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

    console.log("EXIF detected")
    return { type: "exif", value: newEXIF }
  }

  console.warn("unknown format")
  return undefined
}
