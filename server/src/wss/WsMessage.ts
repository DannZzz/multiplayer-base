import { Converter } from "@aeolz/gamekit"

export type WsMessageData<T> = { e: string; d: T }

export class WsMessage {
  static dataToMessage(e: string, data: any): Uint8Array {
    return Converter.objectToBinaryBuffer({ e, d: data })
  }

  static messageToData<T extends any>(msg: Uint8Array): WsMessageData<T> {
    try {
      const d = Converter.binaryBufferToObject(msg) as any
      if (!d || typeof d !== "object" || Array.isArray(d)) return null
      if (!("e" in d) || !("d" in d)) return null
      return { e: d.e, d: d.d }
    } catch (e) {
      console.log(e)
      return null
    }
  }
}
