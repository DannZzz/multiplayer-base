import { Converter } from "@aeolz/gamekit"
import { Listener } from "../utils/EventEmitter"
import { ServerToClientEvents, ClientToServerEvents } from "../share/events"

export let socket: WS
export const connectWS = (api: string) => {
  socket = new WS(api)
}

export const disconnectWS = () => {
  socket?.close()
  socket = null
}

type SC = {
  [k in keyof ServerToClientEvents]: ServerToClientEvents[k]
}

type CS = {
  [k in keyof ClientToServerEvents]: ClientToServerEvents[k]
}
const waitin: [WebSocket, any][] = []

class WS {
  private socket: WebSocket

  listeners: Listener<SC, keyof SC>[] = []

  constructor(url: string) {
    if (
      String(WebSocket) != `function WebSocket() { [native code] }` ||
      WebSocket.toString() != `function WebSocket() { [native code] }` ||
      WebSocket.toLocaleString() != `function WebSocket() { [native code] }` ||
      String(WebSocket.prototype.send) != `function send() { [native code] }` ||
      WebSocket.prototype.send.toString() !=
        `function send() { [native code] }` ||
      WebSocket.prototype.send.toLocaleString() !=
        `function send() { [native code] }`
    ) {
      alert("Please, disable scripts..")
      location.href = location.href
    }
    this.socket = new WebSocket(`ws://localhost:5000` + url)
    this.socket.binaryType = "arraybuffer"
    this.socket.onopen = () => {
      if (!!waitin.length) waitin.forEach(([socket, data]) => socket.send(data))
    }
    this.socket.onmessage = (ev) => {
      const eventObj: any = Converter.binaryBufferToObject(ev.data)
      this.listeners.forEach(
        // @ts-ignore
        (l) => l.event === eventObj.e && l.cb(...eventObj.d)
      )
    }
    this.socket.onclose = () => {
      // console.log("closed")
    }
  }

  on<K extends keyof SC>(event: K, cb: (...data: SC[K]) => void): void {
    this.listeners.push(new Listener(event, cb))
  }

  send<K extends keyof CS>(event: K, ...data: CS[K]): void {
    const noWait = <Array<keyof ClientToServerEvents>>[]
    wsSend(
      this.socket,
      Converter.objectToBinaryBuffer({ e: event, d: data }),
      noWait.includes(event)
    )
  }

  close() {
    this.socket.close()
  }
}
const l = 100
function wsSend(socket: WebSocket, data: any, noWait: boolean = false) {
  // readyState - true, если есть подключение
  if (
    String(WebSocket) != `function WebSocket() { [native code] }` ||
    WebSocket.toString() != `function WebSocket() { [native code] }` ||
    WebSocket.toLocaleString() != `function WebSocket() { [native code] }` ||
    String(WebSocket.prototype.send) != `function send() { [native code] }` ||
    WebSocket.prototype.send.toString() !=
      `function send() { [native code] }` ||
    WebSocket.prototype.send.toLocaleString() !=
      `function send() { [native code] }`
  ) {
    alert("Please, disable scripts..")
    location.href = location.href
    return
  }
  if (!socket.readyState) {
    if (noWait) return
    waitin.push([socket, data])
    if (waitin.length > l) waitin.shift()
  } else {
    socket.send(data)
  }
}
