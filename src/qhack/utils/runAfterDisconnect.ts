import { ActivePlayerAI, ActiveThreat } from '../types'

type Arg = { playerAIs: ActivePlayerAI[], threat: ActiveThreat }

export default function runAfterDisconnect({ playerAIs, threat }: Arg) {
  return (playerAIs.some(({ disconnected }) => !disconnected) || !threat.afterDisconnect)
}