import { SignalMiddleware } from "@aeolz/core/lib/objects/Signal"

export const SignalArrayMiddleware: SignalMiddleware<any[]> = (val) =>
  Array.isArray(val) ? val : []
