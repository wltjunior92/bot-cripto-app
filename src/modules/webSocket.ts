import { IncomingMessage, Server, ServerResponse } from 'http'
import WebSocket from 'ws'

function onError(err: Error) {
  console.error(err)
}

function onMessage(data: any) {
  console.log('test')
  console.log(`WS On Message: ${data} `)
}

function onConnection(
  ws: WebSocket.Server<WebSocket.WebSocket>,
  req: IncomingMessage,
) {
  ws.on('message', onMessage)
  ws.on('error', onError)
  // ws.on('close', (err: any) => {
  //   console.log(err)
  // })
  console.log('WS On Connection')
}

export function webSocketModule(
  server: Server<typeof IncomingMessage, typeof ServerResponse>,
) {
  const wss = new WebSocket.Server({
    server,
  })

  wss.on('connection', onConnection)
  console.log('Web Socket Server is running!')
  return wss
}
