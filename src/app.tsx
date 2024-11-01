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
import { reportError } from "./lib/utils"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Input from "./components/input"
import KMLComponent from "./components/KML"
import NMEAComponent from "./components/NMEA"
import EXIFComponent from "./components/EXIF"

export type SetAllArg = { kml: DecimalDegrees; exif: EXIF; nmea: NMEA }

export function App() {
  const defaultData = NMEAData[2]

  const [nmea, setNmea] = useState<NMEA>(defaultData)
  const [kml, setKml] = useState<DecimalDegrees>(
    NMEAToDecimalDegrees(defaultData)
  )
  const [exif, setExif] = useState<EXIF>(NMEAToDegrees(defaultData))

  const setAll = ({ kml: newKml, exif: newExif, nmea: newNmea }: SetAllArg) => {
    setKml(newKml)
    setNmea(newNmea)
    setExif(newExif)
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
              if (generalInput(event.currentTarget.value)) {
                toast("Coordinates were updated", { type: "success" })
              }
            }}
          />
        </div>
        <KMLComponent kml={kml} setAll={setAll} />
        <NMEAComponent nmea={nmea} setAll={setAll} />
        <EXIFComponent exif={exif} setAll={setAll} />
      </div>
      <ToastContainer />
    </>
  )
}
