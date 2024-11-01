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

export function App() {
  console.log(degreesToNMEA(decimalDegreesToDegrees([50.985435, 11.321463])))

  const defaultData = NMEAData[2]

  const [nmea, setNmea] = useState<NMEA>(defaultData)
  const [kml, setKml] = useState<DecimalDegrees>(
    NMEAToDecimalDegrees(defaultData)
  )
  const [exif, setExif] = useState<EXIF>(NMEAToDegrees(defaultData))

  function updateToKML(target: "lat" | "long", value: number) {
    if (typeof value !== "number" || Number.isNaN(value)) {
      console.error("Invalid value", value, "for kml target", target)
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
          console.error("Invalid value", value, "for nmea target", target)
        } else {
          if (value < 0 || value > 18000) {
            console.error("Invalid value", value, "for nmea target", target)
          } else {
            nmea[0][0] = value as number
          }
        }
        break
      }
      case "latDir": {
        if (!["N", "S"].includes(value as string)) {
          console.error("Invalid value", value, "for nmea target", target)
        } else {
          nmea[0][1] = value as "N" | "S"
        }

        break
      }
      case "long": {
        if (typeof value !== "number") {
          console.error("Invalid value", value, "for nmea target", target)
        } else {
          if (value < 0 || value > 18000) {
            console.error("Invalid value", value, "for nmea target", target)
          } else {
            nmea[1][0] = value as number
          }
        }
        break
      }
      case "longDir": {
        if (!["W", "E"].includes(value as string)) {
          console.error("Invalid value", value, "for nmea target", target)
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
      console.error("Invalid value", value, "for exif target", target)
      return
    }

    if (["latM", "latS", "longM", "longS"].includes(target)) {
      if (value < 0 || value > 60) {
        console.error("Invalid value", value, "for exif target", target)
        return
      }
    }

    if (!["latS", "longS"].includes(target)) {
      value = Math.trunc(value)
    }

    if (target === "latD" && Math.abs(value) > 90) {
      console.error("Invalid value", value, "for exif target", target)
      return
    }

    if (target === "longD" && Math.abs(value) > 180) {
      console.error("Invalid value", value, "for exif target", target)
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

  return (
    <>
      <div>
        <div>
          <p>Google kml (latitude, longitude)</p>
          <input
            type="number"
            name="lat"
            value={kml[0]}
            onChange={(event) => {
              updateToKML("lat", Number.parseFloat(event.currentTarget.value))
            }}></input>
          <input
            type="number"
            name="long"
            value={kml[1]}
            onChange={(event) => {
              updateToKML("long", Number.parseFloat(event.currentTarget.value))
            }}></input>
        </div>
        <div>
          <p>NMEA 0183</p>
          <input
            type="number"
            value={nmea[0][0]}
            onChange={(event) =>
              updateToNMEA("lat", Number.parseFloat(event.currentTarget.value))
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
          <input
            type="number"
            value={nmea[1][0]}
            onChange={(event) =>
              updateToNMEA("long", Number.parseFloat(event.currentTarget.value))
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
        <div>
          <p>JPEG EXIF</p>
          <div>
            <input
              type="number"
              value={exif[0][0]}
              onChange={(event) =>
                updateToExif(
                  "latD",
                  Number.parseInt(event.currentTarget.value, 10)
                )
              }></input>
            ;
            <input
              type="number"
              value={exif[0][1]}
              onChange={(event) =>
                updateToExif(
                  "latM",
                  Number.parseInt(event.currentTarget.value, 10)
                )
              }></input>
            ;
            <input
              type="number"
              value={exif[0][2]}
              onChange={(event) =>
                updateToExif(
                  "latS",
                  Number.parseFloat(event.currentTarget.value)
                )
              }></input>
          </div>
          <div>
            <input
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
            <input
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
            <input
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
    </>
  )
}
