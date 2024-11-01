import { useState } from "preact/hooks"
import "./app.css"
import {
  DecimalDegrees,
  decimalDegreesToDegrees,
  decimalDegreesToNMEA,
  degreesToDecimalDegrees,
  degreesToNMEA,
  EXIF,
  NMEA,
  NMEAToDecimalDegrees,
  NMEAToDegrees,
} from "./lib/conversion"
import { NMEAData } from "./lib/conversion.data"

import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Input from "./components/input"

function reportError(...messages: (string | number)[]) {
  console.error(...messages)
  toast(messages.join(" "), { type: "error" })
}

export function App() {
  const defaultData = NMEAData[2]

  const [nmea, setNmea] = useState<NMEA>(defaultData)
  const [kml, setKml] = useState<DecimalDegrees>(
    NMEAToDecimalDegrees(defaultData)
  )
  const [exif, setExif] = useState<EXIF>(NMEAToDegrees(defaultData))

  function updateToKML(target: "lat" | "long", value: number) {
    if (typeof value !== "number" || Number.isNaN(value)) {
      reportError("Invalid value", value, "for kml target", target)
      return
    }

    if (target === "lat") {
      kml[0] = value
    } else {
      kml[1] = value
    }

    setKml(kml)
    setExif(decimalDegreesToDegrees(kml))
    setNmea(decimalDegreesToNMEA(kml))
  }

  function updateToNMEA(
    target: "lat" | "latDir" | "long" | "longDir",
    value: string | number
  ) {
    switch (target) {
      case "lat": {
        if (typeof value !== "number") {
          reportError("Invalid value", value, "for nmea target", target)
        } else {
          if (value < 0 || value > 18000) {
            reportError("Invalid value", value, "for nmea target", target)
          } else {
            nmea[0][0] = value as number
          }
        }
        break
      }
      case "latDir": {
        if (!["N", "S"].includes(value as string)) {
          reportError("Invalid value", value, "for nmea target", target)
        } else {
          nmea[0][1] = value as "N" | "S"
        }

        break
      }
      case "long": {
        if (typeof value !== "number") {
          reportError("Invalid value", value, "for nmea target", target)
        } else {
          if (value < 0 || value > 18000) {
            reportError("Invalid value", value, "for nmea target", target)
          } else {
            nmea[1][0] = value as number
          }
        }
        break
      }
      case "longDir": {
        if (!["W", "E"].includes(value as string)) {
          reportError("Invalid value", value, "for nmea target", target)
        } else {
          nmea[1][1] = value as "W" | "E"
        }
        break
      }
    }

    setNmea(nmea)
    setKml(NMEAToDecimalDegrees(nmea))
    setExif(NMEAToDegrees(nmea))
  }

  function updateToExif(
    target: "latD" | "latM" | "latS" | "longD" | "longM" | "longS",
    value: number
  ) {
    if (typeof value !== "number" || Number.isNaN(value)) {
      reportError("Invalid value", value, "for exif target", target)
      return
    }

    if (["latM", "latS", "longM", "longS"].includes(target)) {
      if (value < 0 || value > 60) {
        reportError("Invalid value", value, "for exif target", target)
        return
      }
    }

    if (!["latS", "longS"].includes(target)) {
      value = Math.trunc(value)
    }

    if (target === "latD" && Math.abs(value) > 90) {
      reportError("Invalid value", value, "for exif target", target)
      return
    }

    if (target === "longD" && Math.abs(value) > 180) {
      reportError("Invalid value", value, "for exif target", target)
      return
    }

    let index = 0
    if (target.includes("M")) {
      index = 1
    } else {
      index = 2
    }

    exif[target.includes("lat") ? 0 : 1][index] = value

    setExif(exif)
    setKml(degreesToDecimalDegrees(exif))
    setNmea(degreesToNMEA(exif))
  }

  function generalInput(input: string): boolean {
    let match
    if ((match = input.match(/^(\d+\.\d+)\s*,\s*(\d+\.\d+)\s*$/))) {
      const newKML: DecimalDegrees = [
        Number.parseFloat(match[1]),
        Number.parseFloat(match[2]),
      ]
      setKml(newKML)
      setNmea(decimalDegreesToNMEA(newKML))
      setExif(decimalDegreesToDegrees(newKML))
      console.log("KML detected")
      return true
    }

    if (
      (match = input.match(
        /^(\d+\.\d+)\s*,\s*(N|S)\s*,\s*(\d+\.\d+)\s*,\s*(W|E)\s*$/
      ))
    ) {
      if (!["N", "S"].includes(match[2]) || !["W", "E"].includes(match[4])) {
        reportError("Failed to parse NMEA")
        return false
      }
      const newNMEA: NMEA = [
        [Number.parseFloat(match[1]), match[2] as "N" | "S"],
        [Number.parseFloat(match[3]), match[4] as "W" | "E"],
      ]
      setNmea(newNMEA)
      setExif(NMEAToDegrees(newNMEA))
      setKml(NMEAToDecimalDegrees(newNMEA))

      console.log("NMEA detected")
      return true
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
            index === 2
              ? Number.parseFloat(string)
              : Number.parseInt(string, 10)
          ),
        [match[4], match[5], match[6]]
          .map((string) => string.replace(";", ""))
          .map((string, index) =>
            index === 2
              ? Number.parseFloat(string)
              : Number.parseInt(string, 10)
          ),
      ] as EXIF

      setExif(newEXIF)
      setKml(degreesToDecimalDegrees(newEXIF))
      setNmea(degreesToNMEA(newEXIF))
      console.log("EXIF detected")

      return true
    }

    console.warn("unknown format")
    return false
  }

  return (
    <>
      <h1 className="text-2xl font-bold">Coordinates</h1>
      <div>
        <div>
          <p>General Input (format is auto-detected)</p>
          <Input
            type="text"
            onChange={(event) => {
              if (generalInput(event.currentTarget.value))
                event.currentTarget.value = ""
            }}
          />
        </div>
        <div>
          <p>Google kml (latitude, longitude)</p>

          <div className="flex w-full">
            <Input
              type="number"
              name="lat"
              value={kml[0]}
              onChange={(event) => {
                updateToKML("lat", Number.parseFloat(event.currentTarget.value))
              }}
            />
            <Input
              type="number"
              name="long"
              value={kml[1]}
              onChange={(event) => {
                updateToKML(
                  "long",
                  Number.parseFloat(event.currentTarget.value)
                )
              }}
            />
          </div>
        </div>
        <div>
          <p>NMEA 0183</p>
          <div className="flex w-full">
            <Input
              type="number"
              value={nmea[0][0]}
              onChange={(event) =>
                updateToNMEA(
                  "lat",
                  Number.parseFloat(event.currentTarget.value)
                )
              }
            />
            <select
              value={nmea[0][1]}
              onChange={(event) =>
                updateToNMEA("latDir", event.currentTarget.value)
              }>
              <option value="N">N</option>
              <option value="S">S</option>
            </select>
          </div>
          <div className="flex w-full">
            <Input
              type="number"
              value={nmea[1][0]}
              onChange={(event) =>
                updateToNMEA(
                  "long",
                  Number.parseFloat(event.currentTarget.value)
                )
              }
            />
            <select
              value={nmea[1][1]}
              onChange={(event) =>
                updateToNMEA("longDir", event.currentTarget.value)
              }>
              <option value="W">W</option>
              <option value="E">E</option>
            </select>
          </div>
        </div>
        <div>
          <p>JPEG EXIF</p>
          <div className="w-full flex">
            <Input
              type="number"
              value={exif[0][0]}
              onChange={(event) =>
                updateToExif(
                  "latD",
                  Number.parseInt(event.currentTarget.value, 10)
                )
              }
            />
            ;
            <Input
              type="number"
              value={exif[0][1]}
              onChange={(event) =>
                updateToExif(
                  "latM",
                  Number.parseInt(event.currentTarget.value, 10)
                )
              }
            />
            ;
            <Input
              type="number"
              value={exif[0][2]}
              onChange={(event) =>
                updateToExif(
                  "latS",
                  Number.parseFloat(event.currentTarget.value)
                )
              }
            />
          </div>
          <div className="w-full flex">
            <Input
              type="number"
              value={exif[1][0]}
              onChange={(event) =>
                updateToExif(
                  "longD",
                  Number.parseInt(event.currentTarget.value, 10)
                )
              }
            />
            ;
            <Input
              type="number"
              value={exif[1][1]}
              onChange={(event) =>
                updateToExif(
                  "longM",
                  Number.parseInt(event.currentTarget.value, 10)
                )
              }
            />
            ;
            <Input
              type="number"
              value={exif[1][2]}
              onChange={(event) =>
                updateToExif(
                  "longS",
                  Number.parseFloat(event.currentTarget.value)
                )
              }
            />
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  )
}
