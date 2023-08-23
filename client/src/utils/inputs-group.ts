import { NB } from "../share/share.type"
import { PlayerInputsTemplateData } from "../share/templates/template-data"
import { PlayerInputsTemplate } from "../share/templates/templates"

export type PlayerInputGroupKeys = "up" | "down" | "right" | "left" | "clicking"

type Listener = (val: PlayerInputsTemplateData) => void

export class PlayerInputsGroup {
  private data: { [k in PlayerInputGroupKeys]: NB } = {
    up: 0,
    down: 0,
    left: 0,
    right: 0,
    clicking: 0,
  }
  private listeners: Array<Listener> = []
  private lastCheckArray: string = ""

  constructor(
    private arrowKeys: Record<"up" | "down" | "right" | "left", any>,
    private wasdKeys: Record<"up" | "down" | "right" | "left", any>
  ) {}

  setValue(k: PlayerInputGroupKeys, val: boolean, check: boolean = false) {
    this.data[k] = val ? 1 : 0
    if (check) this.checkChange()
    return this
  }

  onChange(cb: Listener) {
    this.listeners.push(cb)
    return this
  }

  update() {
    this.setValue("up", this.arrowKeys.up.isDown || this.wasdKeys.up.isDown)
    this.setValue(
      "down",
      this.arrowKeys.down.isDown || this.wasdKeys.down.isDown
    )
    this.setValue(
      "right",
      this.arrowKeys.right.isDown || this.wasdKeys.right.isDown
    )
    this.setValue(
      "left",
      this.arrowKeys.left.isDown || this.wasdKeys.left.isDown
    )
    this.checkChange()
  }

  private checkChange() {
    const temp = PlayerInputsTemplate.take(this.data)
    if (temp.toString() === this.lastCheckArray) return
    this.lastCheckArray = temp.toString()
    this.listeners.forEach((cb) => cb(temp))
  }
}
