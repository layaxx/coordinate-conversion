import { useState } from "preact/hooks"
import Input from "./input"
import { parseAsKML } from "../lib/parser"
import { DecimalDegrees } from "../lib/conversion"
import { distance } from "../lib/distance"

const Distances = () => {
  const [p1, setP1] = useState<DecimalDegrees | undefined>()
  const [p2, setP2] = useState<DecimalDegrees | undefined>()

  const examples = [
    ["50.974751,11.329992", "50.966975,11.337546"],
    ["N50° 59' 5.165\" E11° 19' 7.882\"", "N50° 59.08608 E11° 19.13137"],
    ["52.518715,13.388361", "40.735649,‐74.010222"],
  ]

  const changeHandler = (input: string, target: "p1" | "p2") => {
    const newValue = parseAsKML(input)

    if (target === "p1") {
      setP1(newValue)
    } else {
      setP2(newValue)
    }
  }

  return (
    <div className="mt-16">
      <h3 className="font-semibold text-xl">Distances</h3>
      <p className="mb-4">
        Paste coordinates into the input fields in any of the formats above or
        click on any of the provided examples
      </p>
      <div className="flex w-full">
        <div className="w-1/2">
          <label>
            First point{" "}
            <Input
              id="p1"
              type="string"
              onChange={(event) =>
                changeHandler(
                  event.currentTarget.value,
                  event.currentTarget.id === "p1" ? "p1" : "p2"
                )
              }
            />
            parsed as {p1?.join(", ") ?? "Failed to parse"}
          </label>
        </div>
        <div className="w-1/2">
          <label>
            Second point{" "}
            <Input
              id="p2"
              type="string"
              onChange={(event) =>
                changeHandler(
                  event.currentTarget.value,
                  event.currentTarget.id === "p1" ? "p1" : "p2"
                )
              }
            />
            parsed as {p2?.join(", ") ?? "Failed to parse"}
          </label>
        </div>
      </div>

      <p className="mt-4">
        Distances between those coordinates is:{" "}
        <span className="font-bold">
          {p1 && p2 ? distance(p1, p2) + " meters" : "unknown"}
        </span>
      </p>

      <h3 className="font-semibold text-xl mt-8">
        Examples from the task sheet (up to 4 decimals)
      </h3>
      <div>
        {examples.map(([a, b]) => {
          const aKML = parseAsKML(a)
          const bKML = parseAsKML(b)

          const distanceString: string =
            !aKML || !bKML
              ? "failed to parse"
              : distance(aKML, bKML).toFixed(4) + " meters"

          return (
            <div className="flex w-full flex-wrap">
              <div
                className="md:w-1/3"
                onClick={() => {
                  setP1(aKML)
                  const elem = document.querySelector<HTMLInputElement>("#p1")
                  if (elem) elem.value = a
                }}>
                {a}
              </div>
              <div
                className="md:w-1/3"
                onClick={() => {
                  setP2(bKML)
                  const elem = document.querySelector<HTMLInputElement>("#p2")
                  if (elem) elem.value = b
                }}>
                {b}
              </div>
              <div className="md:w-1/3">{distanceString}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Distances
