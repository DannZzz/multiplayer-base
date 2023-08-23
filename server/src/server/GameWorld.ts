import {
  AreaBasedItems,
  Size,
  UniversalHitbox,
  Vector2d,
  intersection,
} from "@aeolz/gamekit"
import { Game } from "./Game"

export type WorldObjects = {}

export class World implements WorldObjects {}

export class GameWorld {
  readonly areas: AreaBasedItems<WorldObjects>
  constructor(readonly game: Game) {
    this.areas = new AreaBasedItems<WorldObjects>(
      World,
      this.game.serverConfig.MAP.area
    )

    this.absoluteSize = Size(
      this.game.serverConfig.MAP.size.width *
        this.game.serverConfig.MAP.tile.width,
      this.game.serverConfig.MAP.size.height *
        this.game.serverConfig.MAP.tile.height
    )
  }

  readonly absoluteSize: Size

  intersects(hb: UniversalHitbox): boolean {
    return intersection(hb, { size: this.absoluteSize, point: Vector2d() })
  }
}
