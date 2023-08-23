import { Player } from "./Player"
import { MovementEventTemplate } from "../share/templates/templates"
import { Converter, GameMath, Vector2d, combineVectores } from "@aeolz/gamekit"
import { equal } from "anytool"
import { getNearestAngle } from "../utils/nearest-angle"
import { NB, PlayerInputToggle } from "../share/share.type"

export class PlayerMovement {
  constructor(private readonly player: Player) {}

  releaseMove(delta: number) {
    // setting angle
    // change 1 to rotation speed
    const rotationStep = 1 * delta
    if (
      Math.trunc(this.player.angle() - this.player.targetAngle()) < rotationStep
    ) {
      this.player.angle(this.player.targetAngle())
    } else {
      this.player.angle(
        getNearestAngle(
          this.player.angle(),
          this.player.targetAngle(),
          rotationStep
        )
      )
    }

    // movement
    let angle: number
    if (this.player.inputs?.right) angle = 0
    else if (this.player.inputs?.left) angle = 180

    if (this.player.inputs?.down)
      angle = !isNaN(angle) ? (angle === 0 ? 45 : 135) : 90
    else if (this.player.inputs?.up)
      angle = !isNaN(angle) ? (angle === 0 ? -45 : -135) : -90

    if (angle !== undefined) {
      // change 1 to current speed
      const currentSpeedUpdate = 1 * delta

      let vector = GameMath.vectorWithThetaAndRange(
        Vector2d(),
        Converter.degreesToRadians(angle),
        currentSpeedUpdate
      )
      // math err
      if (angle === 90 || angle === -90) {
        vector.x = 0
      }

      const absolutePosition = combineVectores(vector, this.player.position())
      if (absolutePosition.x < 0) {
        absolutePosition.x = 0
      } else if (
        absolutePosition.x > this.player.game.world.absoluteSize.width
      ) {
        absolutePosition.x = this.player.game.world.absoluteSize.width
      }

      if (absolutePosition.y < 0) {
        absolutePosition.y = 0
      } else if (
        absolutePosition.y > this.player.game.world.absoluteSize.height
      ) {
        absolutePosition.y = this.player.game.world.absoluteSize.height
      }

      this.player.position(absolutePosition)
      // console.log("update movement", absolutePosition)
    }

    this.sendData()
  }

  sendData() {
    // ready to send
    const socketData = MovementEventTemplate.take(this.player)
    const [playerId, ...cacheData] = socketData

    if (!equal(cacheData, this.player.cache.values.get("movement"))) {
      this.player.cache.values.set("movement", cacheData)
      this.player.connection.send({ me: true }, "movement", socketData)
    }
  }
}
