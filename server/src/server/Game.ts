import { Collection } from "@discordjs/collection"
import { PlayerConfiguration, ServerConfiguration } from "../config/config"
import { Player } from "../player/Player"
import {
  AreaBasedItems,
  GameLoop,
  TokenCollection,
  UniversalHitbox,
  Vector2d,
} from "@aeolz/gamekit"
import { uuid } from "../utils/uuid"
import { PerfectSocket } from "../wss/PerfectSocket"
import { Wss } from "../wss/setup-connection"
import { randomNumber } from "anytool"
import { PlayerJoinData } from "./game-types"
import { GameWorld } from "./GameWorld"
import { Connector } from "./Connector"

export type GameConfigurations = {
  player: PlayerConfiguration
}
export type GameTokenData = { id: string; socketId: string }

export class Game {
  constructor(
    readonly serverConfig: ServerConfiguration,
    readonly configurations: GameConfigurations,
    readonly webServer: Wss
  ) {
    this.world = new GameWorld(this)
    this.connector = new Connector(this)
    this.initLoop()
  }

  loop: GameLoop
  readonly players = new Collection<string, Player>()
  readonly tokens = new TokenCollection<GameTokenData>()
  readonly world: GameWorld
  readonly connector: Connector

  join(data: PlayerJoinData): void {
    const existToken = this.tokens.get(data.token)
    if (!!existToken) return this.reJoin(existToken)

    const { username, socketId, screen } = data

    const id = uuid()
    const token = this.tokens.create({ id, socketId })

    const player: Player = new Player({
      socket: new PerfectSocket(
        () => this.webServer.sockets[this.tokens.get(player.token)?.socketId]
      ),
      token,
      screen,
      id,
      name: username,
      game: this,
    })
    player.position(this.getRandomVectorFor())
    this.players.set(id, player) //
    player.ready()
  }

  getRandomVectorFor(hitbox?: UniversalHitbox): Vector2d {
    const random = () =>
      Vector2d(
        randomNumber(
          0,
          this.serverConfig.MAP.size.width * this.serverConfig.MAP.tile.width
        ),
        randomNumber(
          0,
          this.serverConfig.MAP.size.height * this.serverConfig.MAP.tile.height
        )
      )
    // ...
    return random()
  }

  reJoin(tokenData: GameTokenData) {}

  disconnected(socketId: string) {
    const p = this.players.get(this.tokens.findByKey("socketId", socketId)?.id)
    if (p) {
      p.die()
      // experimental
      this.players.delete(p.id)
    }
  }

  initLoop() {
    this.loop = new GameLoop("game-loop", {
      fps: this.serverConfig.GAME_FPS,
    })

    this.loop.request({
      callback: (delta) => {
        this.players.forEach((player) => {
          player.update(delta)
        })
      },
    })
  }
}
