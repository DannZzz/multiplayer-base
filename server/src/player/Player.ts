import {
  GameKitSignalMiddlewares,
  Shape,
  Size,
  Vector2d,
  combineSizes,
  combineVectores,
} from "@aeolz/gamekit"
import { UniversalHitbox } from "@aeolz/gamekit/lib/objects/UniversalHitbox"
import { PerfectSocket } from "../wss/PerfectSocket"
import { Game } from "../server/Game"
import { Signal } from "@aeolz/core/lib/objects/Signal"
import { NumberSignal } from "../utils/number.signal"
import { updatePlayer } from "./update-player"
import { PlayerMovement } from "./PlayerMovement"
import { PlayerCache } from "./PlayerCache"
import { VectorSignal } from "../utils/typed-signals"
import { NB, PlayerInputToggle } from "../share/share.type"
import { Connection } from "../server/Connector"
import { PlayerActions } from "./PlayerActions"

type PlayerPropsImplementation = {
  socket: PerfectSocket
  token: string
  name: string
  id: string
  game: Game
}

type PlayerPropsAbsolute = {
  screen: Size
}

export type PlayerProps = PlayerPropsImplementation & PlayerPropsAbsolute

export class Player extends Shape implements PlayerPropsImplementation {
  constructor(props: PlayerProps) {
    super()
    Object.assign(this, props)

    // init
    this.screen = Signal(props.screen)
      .middleware(GameKitSignalMiddlewares.sizeFilter)
      .pipe((size) =>
        combineSizes(size, this.game.serverConfig.PLAYER.camera_view_extra_size)
      )
    this.cache = new PlayerCache()
    this.connection = this.game.connector.createConnection(this.id)
    this.movement = new PlayerMovement(this)
    this.actions = new PlayerActions(this)
  }
  screen: Signal<Size>
  game: Game
  id: string
  name: string
  token: string
  readonly targetAngle = NumberSignal()
  readonly angle = NumberSignal()
  readonly movement: PlayerMovement
  readonly actions: PlayerActions
  readonly cache: PlayerCache
  readonly connection: Connection
  socket: PerfectSocket
  pointer = VectorSignal(Vector2d(300, 300))
  inputs: Record<PlayerInputToggle, NB> = <any>{}
  acceptable: boolean = false

  // private props
  private _alive = true

  get alive() {
    return this._alive
  }

  get hitbox(): UniversalHitbox {
    return {
      radius: 100,
      point: this.position(),
    }
  }

  die() {
    if (!this.alive) return
    this._alive = false
    this.game.webServer.ips.delete(
      this.game.webServer.ips.findKey((obj) => obj.socketId === this.socket.id)
    )

    this.game.tokens.delete(this.token)
    this.game.disconnected(this.socket.id)
  }

  update(delta: number) {
    updatePlayer.call(this, delta)
  }

  get screenBox(): UniversalHitbox {
    return {
      point: combineVectores(
        this.position(),
        Vector2d(this.screen().width / -2, this.screen().height / -2)
      ),
      size: this.screen(),
    }
  }

  ready() {
    if (this.socket.ws()) this.socket.ws().joined = true

    this.cache.onListChange("players", (added, player) => {
      if (added) {
        // this.socket.send("player", [added, player.id, player.name, 0]);
      } else {
        // this.socket.send("player", [added, player.id]);
      }
    })
  }
}
