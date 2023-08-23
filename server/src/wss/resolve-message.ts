import { Socket } from "../typing/Socket"
import { Wss } from "./setup-connection"
import { WsMessage } from "./WsMessage"

export const resolveWsMessage = function (this: Wss, ws: Socket, data: any) {
  if (!data || typeof data === "string") return
  const msg = WsMessage.messageToData(data)
  if (!msg) return
  if (!ws.joined && msg.e !== "join") return
  this.useMessage(msg, ws)
}
