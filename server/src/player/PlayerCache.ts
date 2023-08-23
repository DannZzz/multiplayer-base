import { CacheManager } from "@aeolz/core/lib/objects/CacheManager"
import { Player } from "./Player"
import { Signal } from "@aeolz/core/lib/objects/Signal"
import { SignalArrayMiddleware } from "../utils/signal-array.middleware"
import { ArrayElementType } from "../typing/helpers"

export type PlayerCacheState = {
  players: Player[]
}

export type PlayerCacheValues = {
  movement: [x: number, y: number, angle: number]
  actions: [biting: number]
}

export class PlayerCache {
  private cache: CacheManager<PlayerCacheStateSignals>
  public values: CacheManager<PlayerCacheValues>
  constructor() {
    this.clear()
  }

  get players() {
    return this.cache.get("players")
  }

  clear() {
    this.cache?.destroy()
    this.values?.destroy()
    this.cache = new CacheManager<PlayerCacheStateSignals>({
      initialValue: {
        players: Signal([]).middleware(SignalArrayMiddleware),
      },
    })
    this.values = new CacheManager<PlayerCacheValues>({
      initialValue: { movement: <any>[null], actions: <any>[false] },
    })
  }

  mapped<
    K extends keyof PlayerCacheState,
    O extends keyof ArrayElementType<PlayerCacheState[K]>
  >(key: K, mapKey: O): Array<ArrayElementType<PlayerCacheState[K]>[O]> {
    return this.cache
      .get(key)()
      .map(
        (p) =>
          // @ts-ignore
          p[mapKey]
      )
  }

  onListChange<K extends keyof PlayerCacheState>(
    key: K,
    cb: (added: boolean, item: ArrayElementType<PlayerCacheState[K]>) => void,
    listItemKey: keyof ArrayElementType<PlayerCacheState[K]> = "id"
  ): this {
    if (!Array.isArray(this.cache.get(key)())) return this
    this.cache.get(key).on("change", (newVal, oldVal) => {
      const newIds = newVal.map(
        (val) =>
          // @ts-ignore
          val[listItemKey]
      )

      const oldIds = oldVal.map(
        (val) =>
          // @ts-ignore
          val[listItemKey]
      )
      newVal.forEach((item) => {
        if (!oldIds.includes((item as any)[listItemKey])) {
          cb(true, item as any)
        }
      })
      oldVal.forEach((item) => {
        if (!newIds.includes((item as any)[listItemKey])) {
          cb(false, item as any)
        }
      })
    })
    return this
  }
}

export type PlayerCacheStateSignals = {
  [k in keyof PlayerCacheState]: Signal<PlayerCacheState[k]>
}
