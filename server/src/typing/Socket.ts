import Aeolz from "@aeolz/core"
import { WebSocket } from "ws"

export type Socket = {
  id: string
  messageAmountWithin5secs: number
  joined: boolean
  eventsRateLimits: Array<{ e: string; rateLimiter: Aeolz.RateLimiter }>
} & WebSocket
