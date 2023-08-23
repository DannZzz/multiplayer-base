import { Socket } from "../typing/Socket"
import { ServerToClientEvents } from "../share/events"
import { WsMessage } from "./WsMessage"

export class PerfectSocket {
  constructor(readonly ws: () => Socket) {}

  send<K extends keyof ServerToClientEvents>(
    e: K,
    data: ServerToClientEvents[K]
  ) {
    this.ws()?.send(WsMessage.dataToMessage(e, data))
    return this
  }

  get id() {
    return this.ws()?.id
  }

  close() {
    this.ws()?.close()
    return this
  }
}
