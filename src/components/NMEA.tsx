import { FC } from "preact/compat"
import { SetAllArg } from "../app"
import { NMEA, NMEAToDecimalDegrees, NMEAToDegrees } from "../lib/conversion"
import Input from "./input"
import { reportError } from "../lib/utils"
import { validateNMEA } from "../lib/validation"

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
        nmea[0][0] = value as number
        break
      }
      case "latDir": {
        nmea[0][1] = value as "N" | "S"
        break
      }
      case "long": {
        nmea[1][0] = value as number
        break
      }
      case "longDir": {
        nmea[1][1] = value as "W" | "E"
        break
      }
    }
    const validationResult = validateNMEA(nmea)
    if (validationResult.success) {
      const kml = NMEAToDecimalDegrees(nmea)
      const exif = NMEAToDegrees(nmea)

      setAll({ nmea, exif, kml })
    } else {
      reportError(validationResult.error)
    }
  }

  return (
    <div>
      <h3 className="font-semibold text-lg my-2">NMEA 0183</h3>
      <div className="flex w-full">
        <div className="flex ">
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
        <div className="flex ">
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
    </div>
  )
}

export default NMEAComponent
