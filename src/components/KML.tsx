import { FC } from "preact/compat"
import {
  DecimalDegrees,
  decimalDegreesToDegrees,
  decimalDegreesToNMEA,
} from "../lib/conversion"
import { reportError } from "../lib/utils"
import Input from "./input"
import { SetAllArg } from "../app"

const KMLComponent: FC<{
  kml: DecimalDegrees
  setAll: (arg: SetAllArg) => void
}> = ({ kml, setAll }) => {
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
    const exif = decimalDegreesToDegrees(kml)
    const nmea = decimalDegreesToNMEA(kml)

    setAll({ kml, exif, nmea })
  }

  return (
    <div>
      <h3 className="font-semibold text-lg my-2">
        Google kml (latitude, longitude)
      </h3>

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
            updateToKML("long", Number.parseFloat(event.currentTarget.value))
          }}
        />
      </div>
    </div>
  )
}

export default KMLComponent
