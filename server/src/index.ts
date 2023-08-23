import express from "express"
import dotenv from "dotenv"

dotenv.config()

import * as http from "http"
import * as WebSocket from "ws"
import { setupWsConnection } from "./wss/setup-connection"
import { join, resolve } from "path"
import { Config } from "./config/config"
import ServerConfig from "./config/server.config.json"
import PlayerConfig from "./config/player.config.json"

const app = express()
const port = process.env.PORT || 5000

app.use(express.static(join(__dirname, "../public")))

//initialize a simple http server
const server = http.createServer(app)

//initialize the WebSocket server instance
const wss = new WebSocket.Server({
  server,
  maxPayload: 128 * 1024,
  path: "/ws",
})
setupWsConnection(wss, new Config(ServerConfig, PlayerConfig))

//start our server
server.listen(port, () => {
  console.log(`Server started on port ${port} :)`)
})
