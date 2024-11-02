import { expect, test, vi } from "vitest"
import { realWorldParsingData } from "./parser.data"
import { generalInput } from "./parser"

vi.mock("react-toastify", () => ({ toast: vi.fn() }))

test.each(realWorldParsingData)(
  "real world data parses as expected",
  (input, expectedType, expectedValue) => {
    const parsingResult = generalInput(input)

    expect(parsingResult).toBeDefined()

    expect(parsingResult?.type).toEqual(expectedType)
    expect(parsingResult?.value).toEqual(expectedValue)
  }
)
