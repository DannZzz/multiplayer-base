import { equal } from "anytool"
import { Player } from "./Player"
import { ServerToClientEvents } from "../share/events"

export class PlayerActions {
  constructor(private player: Player) {}

  releaseActions(delta: number) {
    // ...
    this.sendData()
  }

  sendData() {
    // ready to send
    // some changes
    //
  }
}
