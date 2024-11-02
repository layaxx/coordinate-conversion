import { toast } from "react-toastify"
import { ZodError } from "zod"

export function reportError(...messages: (string | number)[] | [ZodError]) {
  if (messages[0] instanceof ZodError) {
    console.error(messages[0])
    toast.error(messages[0].issues.map((i) => i.message).join(","))
  } else {
    console.error(...messages)
    toast(messages.join(" "), { type: "error" })
  }
}
