import { Converter, GameMath } from "@aeolz/gamekit"
import { Player } from "./Player"

export function updatePlayer(this: Player, delta: number) {
  // waiting for an event from client-side
  if (!this.acceptable) return

  // releasing the movement
  this.movement.releaseMove(delta)
  
  // releasing the actions
  this.actions.releaseActions(delta)

  // checking players within view
  const players = this.game.players.filter((player) =>
    player.intersects(this.screenBox)
  )
  this.cache.players([...players.values()])
}
