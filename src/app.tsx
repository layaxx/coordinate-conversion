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
import KMLComponent from "./components/KML"
import NMEAComponent from "./components/NMEA"
import EXIFComponent from "./components/EXIF"
import Distances from "./components/Distances"
import { generalInput } from "./lib/parser"

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
              const response = generalInput(event.currentTarget.value)
              if (response) {
                switch (response.type) {
                  case "exif": {
                    setExif(response.value)
                    setNmea(degreesToNMEA(response.value))
                    setKml(degreesToDecimalDegrees(response.value))
                    break
                  }
                  case "kml": {
                    setKml(response.value)
                    setExif(decimalDegreesToDegrees(response.value))
                    setNmea(decimalDegreesToNMEA(response.value))
                    break
                  }
                  case "nmea": {
                    setNmea(response.value)
                    setExif(NMEAToDegrees(response.value))
                    setKml(NMEAToDecimalDegrees(response.value))
                    break
                  }
                }
                toast("Coordinates were updated", { type: "success" })
              }
            }}
          />
          <p>
            Either paste a string in the box above or adjust any of the inputs
            below. All other formats (not the field above) will adapt to any
            changes. If you want to input decimal formats, you might need to put
            a dot between digits, at the end does not work. NMEA Coordinates are
            displayed without leading zeroes. KML Coordinates must be latitude
            first.
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

        <div>
          <Distances />
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
