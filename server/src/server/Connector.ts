import { ServerToClientEvents } from "../share/events"
import { Game } from "./Game"

type ConnectorMessage<K extends keyof ServerToClientEvents> = {
  options: ConnectionMessageOptions
  id: string
  e: K
  data: ServerToClientEvents[K]
}

export class Connector {
  constructor(private game: Game) {}

  createConnection(playerId: string): Connection {
    return new Connection(this, playerId)
  }

  expectMessage<K extends keyof ServerToClientEvents>(
    message: ConnectorMessage<K>
  ) {
    const { options, id, e, data } = message

    this.game.players.forEach((player) => {
      if (!options.me && player.id === id) return

      const me = player.cache.players().find((p) => p.id === id)
      if (!me) return
      player.socket.send(e, data)
    })
  }
}

type ConnectionMessageOptions = {
  me: boolean
}

export class Connection {
  constructor(private connector: Connector, private id: string) {}

  send<K extends keyof ServerToClientEvents>(
    options: ConnectionMessageOptions,
    e: K,
    data: ServerToClientEvents[K]
  ): this {
    this.connector.expectMessage({
      data,
      e,
      options,
      id: this.id,
    })
    return this
  }
}
