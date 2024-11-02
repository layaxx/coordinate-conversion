import { expect, test } from "vitest"
import { DecimalDegrees } from "./conversion"
import { distance } from "./distance"

const data: Array<[DecimalDegrees, DecimalDegrees, number]> = [
  [
    [50.733696220256775, 13.15965522052949],
    [50.7331595144121, 13.165312156745792],
    402.57,
  ],
  [
    [43.87399725969068, 10.725296598943647],
    [47.98901215712083, 16.053717643712343],
    615_481.22,
  ],
  [
    [48.21546962801663, 16.266943164064518],
    [6.458087932883251, 43.62619569791889],
    5_313_485.18,
  ],
  [
    [-29.318451669646084, 28.062152800701924],
    [6.213237188918379, 43.706684916217064],
    4_290_469.49,
  ],
  [
    [33.9310940999472, -101.84019813599116],
    [31.265914557086788, 77.80824930284557],
    12_765_416.51,
  ],
]

test.each(data)(
  "distance measuring works as intended",
  (in1, in2, expected) => {
    const actualDistance = distance(in1, in2)

    expect(actualDistance).toBeCloseTo(expected)
  }
)
