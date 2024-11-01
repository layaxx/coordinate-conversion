import "./app.css"
import { decimalDegreesToDegrees, degreesToNMEA } from "./lib/conversion"

export function App() {
  console.log(degreesToNMEA(decimalDegreesToDegrees([50.985435, 11.321463])))

  return (
    <>
      <div>
        <div>
          <p>Google kml</p>
          <input></input>
          <input></input>
        </div>
        <div>
          <p>NMEA 0183</p>
          <input type="number"></input>
          <select>
            <option>N</option>
            <option>S</option>
          </select>
          <input type="number"></input>
          <select>
            <option>W</option>
            <option>E</option>
          </select>
        </div>
        <div>
          <p>JPEG EXIF</p>
          <div>
            <input></input>;<input></input>;<input></input>
          </div>
          <div>
            <input></input>;<input></input>;<input></input>
          </div>
        </div>
      </div>
    </>
  )
}
