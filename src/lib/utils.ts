import { toast } from "react-toastify"

export function reportError(...messages: (string | number)[]) {
  console.error(...messages)
  toast(messages.join(" "), { type: "error" })
}
