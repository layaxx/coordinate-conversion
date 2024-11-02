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
      <header className="bg-slate-600 text-slate-100 w-full">
        <div className="mx-auto max-w-screen-lg p-4">
          <h1 className="text-2xl font-bold">
            Coordinate Conversion & Distances
          </h1>
        </div>
      </header>
      <main className="flex-grow p-4 md:p-8 max-w-screen-lg md:pt-2">
        <div className="mb-8">
          <h3 className="font-semibold text-lg my-2">
            General Input (format is auto-detected)
          </h3>
          <Input
            type="text"
            onChange={(event) => {
              if (generalInput(event.currentTarget.value)) {
                toast("Coordinates were updated", { type: "success" })
              }
            }}
          />
          <p>
            Either paste a string in the box above or adjust any of the inputs
            below. All other formats (not the field above) will adapt to any
            changes. If you want to input decimal formats, you might need to put
            a dot between digits, at the end does not work.
          </p>
        </div>
        <hr />
        <KMLComponent kml={kml} setAll={setAll} />
        <NMEAComponent nmea={nmea} setAll={setAll} />
        <EXIFComponent exif={exif} setAll={setAll} />

        <div className="border border-black mt-4">
          <h2 className="text-2xl font-semibold my-2">Overview</h2>
          <table>
            <tbody id="coord-table">
              <tr>
                <th>Google KML</th>
                <td>
                  {kml[0]}, {kml[1]}
                </td>
              </tr>
              <tr>
                <th>NMEA 0183</th>
                <td>
                  {nmea[0][0]},{nmea[0][1]},{nmea[1][0]},{nmea[1][1]}
                </td>
              </tr>
              <tr>
                <th>JPEG EXIF</th>
                <td>
                  {exif[0].join(";")}
                  <br />
                  {exif[1].join(";")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>

      <footer className="bg-slate-600 text-slate-100 w-full ">
        <div className="mx-auto max-w-screen-lg px-4 py-2">
          <h2 className="font-bold">by Yannick Lang for UiXD</h2>
        </div>
      </footer>
      <ToastContainer />
    </>
  )
}
