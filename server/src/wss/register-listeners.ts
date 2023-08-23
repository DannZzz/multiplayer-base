import { Size, Vector2d, isSize } from "@aeolz/gamekit"
import { Wss } from "./setup-connection"
import { PlayerInputsTemplate } from "../share/templates/templates"

export default function registerListeners(this: Wss) {
    this.on("pointer", { requirePlayer: true }, ({ ws, player }, angle) => {
      player.targetAngle(angle)
    })
    .on("inputs", { requirePlayer: true }, ({ ws, player }, ...inputs) => {
      const inputsObject = PlayerInputsTemplate.toObject(inputs)
      player.inputs = inputsObject as any
    })
}
