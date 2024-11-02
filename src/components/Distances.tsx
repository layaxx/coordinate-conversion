import { useState } from "preact/hooks"
import Input from "./input"
import { KeyboardEventHandler } from "preact/compat"
import { generalInput } from "../lib/parser"
import {
  DecimalDegrees,
  degreesToDecimalDegrees,
  NMEAToDecimalDegrees,
} from "../lib/conversion"
import { distance } from "../lib/distance"

const Distances = () => {
  const [p1, setP1] = useState<DecimalDegrees | undefined>()
  const [p2, setP2] = useState<DecimalDegrees | undefined>()

  const changeHandler: KeyboardEventHandler<HTMLInputElement> = (event) => {
    const response = generalInput(event.currentTarget.value)

    let newValue
    if (response) {
      switch (response.type) {
        case "exif":
          newValue = degreesToDecimalDegrees(response.value)
          break
        case "kml":
          newValue = response.value
          break
        case "nmea":
          newValue = NMEAToDecimalDegrees(response.value)
          break
      }
    }

    if (event.currentTarget.id === "p1") {
      setP1(newValue)
    } else {
      setP2(newValue)
    }
  }

  return (
    <div className="mt-16">
      <h3 className="font-semibold text-xl">Distances</h3>
      <div className="flex w-full">
        <div className="w-1/2">
          <label>
            First point <Input id="p1" type="string" onChange={changeHandler} />
            parsed as {p1?.join(", ") ?? "Failed to parse"}
          </label>
        </div>
        <div className="w-1/2">
          <label>
            Second point{" "}
            <Input id="p2" type="string" onChange={changeHandler} />
            parsed as {p2?.join(", ") ?? "Failed to parse"}
          </label>
        </div>
      </div>

      <p>
        Distances between those coordinates is:{" "}
        {p1 && p2 ? distance(p1, p2) + " meters" : "unknown"}
      </p>
    </div>
  )
}

export default Distances
