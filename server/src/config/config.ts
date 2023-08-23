import { Prettify } from "@aeolz/core/lib/Type"
import ServerConfig from "./server.config.json"
import PlayerConfig from "./player.config.json"

export type ServerConfiguration = Prettify<typeof ServerConfig>
export type PlayerConfiguration = Prettify<typeof PlayerConfig>

export class Config {
  constructor(
    readonly server: Readonly<ServerConfiguration>,
    readonly player: Readonly<PlayerConfiguration>
  ) {}
}
