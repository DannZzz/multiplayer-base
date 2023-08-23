import Aeolz from "@aeolz/core"
import { IncomingMessage } from "http"
import { resolveWsMessage } from "./resolve-message"
import { WsMessage, WsMessageData } from "./WsMessage"
import { ClientToServerEvents } from "../share/events"
import registerListeners from "./register-listeners"
import { Socket } from "../typing/Socket"
import { WebServer } from "../typing/WebServer"
import { uuid } from "../utils/uuid"
import { Game } from "../server/Game"
import { Collection } from "@discordjs/collection"
import { Player } from "../player/Player"
import { Config } from "../config/config"

export type WsMessageListener<T extends any[]> = (
  options: { ws: Socket; player: Player },
  ...data: T
) => void

export type WsMessageListenerOptions = {
  rateLimiter?: [maxCalls: number, ms: number]
  requirePlayer?: boolean
}

export class Wss {
  constructor(readonly server: WebServer, readonly config: Config) {
    this.init()
    registerListeners.call(this)

    this.game = new Game(
      config.server,
      {
        player: config.player,
      },
      this
    )
  }

  readonly game: Game
  private listeners: Array<
    {
      event: string
      cb: WsMessageListener<any>
    } & WsMessageListenerOptions
  > = []
  readonly ips = new Collection<
    string,
    {
      socketId: string
    }
  >()

  sockets: Record<string, Socket> = {}

  readonly messagesPer5sInterval = new Aeolz.Interval(
    () =>
      this.server.clients.forEach((socket) => {
        ;(socket as any).messagesPer5s = 0
      }),
    5000
  )

  useMessage(message: WsMessageData<any>, socket: Socket) {
    this.listeners.forEach((lst) => {
      if (lst.event === message?.e) {
        if (lst.rateLimiter) {
          let rt = socket.eventsRateLimits.find((ev) => ev.e === message.e)
          if (!rt) {
            rt = {
              e: message.e,
              rateLimiter: new Aeolz.RateLimiter(
                lst.rateLimiter[0],
                lst.rateLimiter[1]
              ),
            }
            socket.eventsRateLimits.push(rt)
          }
          if (!rt.rateLimiter.call())
            return console.log("Rate Limit for", message.e)
        }
        const player = this.to(socket.id)
        if (lst.requirePlayer && !player) return
        lst.cb(
          {
            ws: socket,
            player,
          },
          ...(Array.isArray(message?.d) ? message.d : [])
        )
      }
    })
  }

  on<K extends keyof ClientToServerEvents>(
    event: K,
    cb: WsMessageListener<ClientToServerEvents[K]>
  ): this
  on<K extends keyof ClientToServerEvents>(
    event: K,
    options: WsMessageListenerOptions,
    cb: WsMessageListener<ClientToServerEvents[K]>
  ): this
  on<K extends keyof ClientToServerEvents>(
    event: K,
    options:
      | WsMessageListener<ClientToServerEvents[K]>
      | WsMessageListenerOptions,
    cb?: WsMessageListener<ClientToServerEvents[K]>
  ) {
    let opts: WsMessageListenerOptions
    let _cb: WsMessageListener<ClientToServerEvents[K]>
    if (typeof options === "object") {
      opts = options
      _cb = cb
    } else {
      _cb = options
      opts = {}
    }
    const { rateLimiter = null, requirePlayer = false } = opts

    this.listeners.push({
      event,
      requirePlayer,
      cb: _cb,
      rateLimiter,
    })
    return this
  }

  init() {
    this.server.on("connection", (ws: Socket, req) => {
      let ip = Array.isArray(req.headers["x-forwarded-for"])
        ? req.headers["x-forwarded-for"][0]
        : req.headers["x-forwarded-for"]
      ip = process.env.NODE_ENV === "production" ? ip?.split(", ")[0] : "test"
      console.log("join ip", ip)
      if (!ip) {
        console.log("no ip, closing")
        return ws.close()
      }

      // assignin custom props to websocket
      ws.id = uuid()
      ws.eventsRateLimits = []

      ws.on("close", () => {
        this.game.disconnected(ws.id)
        delete this.sockets[ws.id]
      })

      const exists = this.ips.get(ip)
      if (exists) {
        // return ws.close()
      } else {
        this.ips.set(ip, { socketId: ws.id })
      }

      this.sockets[ws.id] = ws

      ws.on("message", (data) => resolveWsMessage.call(this, ws, data))
    })
  }

  to(socketId: string): Player {
    return this.game.players.find((player) => player.socket.id === socketId)
  }
}

export function setupWsConnection(server: WebServer, config: Config) {
  new Wss(server, config)
}
