import { degreesToDecimalDegrees, degreesToNMEA, EXIF } from "../lib/conversion"
import Input from "./input"
import { reportError } from "../lib/utils"
import { FC } from "preact/compat"
import { SetAllArg } from "../app"

const EXIFComponent: FC<{
  exif: EXIF
  setAll: (arg: SetAllArg) => void
}> = ({ exif, setAll }) => {
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

    const kml = degreesToDecimalDegrees(exif)
    const nmea = degreesToNMEA(exif)

    setAll({ exif, kml, nmea })
  }

  return (
    <div>
      <p>JPEG EXIF</p>
      <div className="w-full flex">
        <Input
          type="number"
          value={exif[0][0]}
          onChange={(event) =>
            updateToExif("latD", Number.parseInt(event.currentTarget.value, 10))
          }
        />
        ;
        <Input
          type="number"
          value={exif[0][1]}
          onChange={(event) =>
            updateToExif("latM", Number.parseInt(event.currentTarget.value, 10))
          }
        />
        ;
        <Input
          type="number"
          value={exif[0][2]}
          onChange={(event) =>
            updateToExif("latS", Number.parseFloat(event.currentTarget.value))
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
            updateToExif("longS", Number.parseFloat(event.currentTarget.value))
          }
        />
      </div>
    </div>
  )
}

export default EXIFComponent
