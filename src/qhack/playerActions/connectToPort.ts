import { TickSubstep } from '../types'
import { findAllowedPortAction, incrementActionUses, lineParser } from '../utils'

export type ConnectAction = {
  type: 'connect to port',
  toPort: string
  tickTimit?: number
  hackLimit?: number
}

export const parser = (line: string): ConnectAction | undefined => {
  // "connect to port 3"
  const connectRegex = /^connect\s+to\s+port\s+(?<toPort>[0-9a-z]+)/i
  const match = connectRegex.exec(line)?.groups
  if (!match) {
    return undefined
  }
  return {
    type: 'connect to port',
    toPort: match.toPort,
    ...lineParser.tickLimit(line),
    ...lineParser.hackLimit(line),
  }
}

export const runner: TickSubstep = ({ action, playerAI, server }) => {
  let portAction: ConnectAction 
  try {
    portAction = findAllowedPortAction(action, playerAI, server) as ConnectAction
  } catch (e) {
    return { log: e.message }
  }

  if (!server.ports[portAction.toPort]) {
    return { log: `ERROR: connecting to non-existent port ${portAction.toPort}` }
  }

  if (playerAI.currentPort === portAction.toPort) {
    return { log: `tried to connect to port ${portAction.toPort}; already connected` }
  }

  return {
    log: `connect to port ${portAction.toPort}`,
    server: incrementActionUses(portAction, server),
    playerAI: { ...playerAI, currentPort: portAction.toPort }
  }
}
