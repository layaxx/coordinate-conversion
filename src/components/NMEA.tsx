import { FC } from "preact/compat"
import { SetAllArg } from "../app"
import { NMEA, NMEAToDecimalDegrees, NMEAToDegrees } from "../lib/conversion"
import Input from "./input"
import { reportError } from "../lib/utils"

const NMEAComponent: FC<{
  nmea: NMEA
  setAll: (arg: SetAllArg) => void
}> = ({ nmea, setAll }) => {
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

    const kml = NMEAToDecimalDegrees(nmea)
    const exif = NMEAToDegrees(nmea)

    setAll({ nmea, exif, kml })
  }

  return (
    <div>
      <p>NMEA 0183</p>
      <div className="flex w-full">
        <Input
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
      </div>
      <div className="flex w-full">
        <Input
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
    </div>
  )
}

export default NMEAComponent
