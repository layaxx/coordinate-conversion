import { expect, test } from "vitest"
import { realWorldParsingData } from "./parser.data"
import { generalInput } from "./parser"

test.each(realWorldParsingData)(
  "real world data parses as expected",
  (input, expectedType, expectedValue) => {
    const parsingResult = generalInput(input)

    expect(parsingResult).toBeDefined()

    expect(parsingResult?.type).toEqual(expectedType)
    expect(parsingResult?.value).toEqual(expectedValue)
  }
)
