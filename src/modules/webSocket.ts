import { env } from '@/env'
import { IncomingMessage, Server, ServerResponse } from 'http'
import jwt from 'jsonwebtoken'
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

function corsValidation(origin: string) {
  return env.CORS_ORIGIN.startsWith(origin)
}

function verifyClient(
  info: any,
  callback: (result: boolean, errorCode: number) => void,
) {
  const isCorsValidated = corsValidation(info.origin)
  if (!isCorsValidated) {
    return callback(isCorsValidated, 401)
  }

  const [, token] = info.req.url.split('token=')

  if (token) {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET)
      if (decoded) {
        return callback(true, 200)
      }
    } catch (error) {
      console.log(token, error)
    }
  }
  callback(false, 401)
}

export function webSocketModule(
  server: Server<typeof IncomingMessage, typeof ServerResponse>,
) {
  const wss = new WebSocket.Server({
    server,
    verifyClient,
  })

  wss.on('connection', onConnection)
  console.log('Web Socket Server is running!')
  return wss
}
