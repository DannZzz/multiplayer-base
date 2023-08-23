import Aeolz from "@aeolz/core"
import { Signal } from "@aeolz/core/lib/objects/Signal"

export const NumberSignal = (init: number = 0) =>
  Signal(init).middleware((val) => (Aeolz.Utils.isNumber(val) ? val : 0))
