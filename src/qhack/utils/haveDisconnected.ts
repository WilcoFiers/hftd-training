import { ActivePlayerAI } from '../types'

export default function haveDisconnected(playerAIs: ActivePlayerAI[]) {
  return (playerAIs.every(({ disconnected }) => disconnected))
}
