import { TickSubstep, ConnectAction } from '../types'
import { findAllowedPortAction, incrementActionUses, lineParser } from '../utils'

export const parser = (line: string): ConnectAction | undefined => {
  // "connect to port 3"
  const connectRegex = /^connect\s+to\s+port\s+(?<to_port>[0-9a-z]+)/i
  const match = connectRegex.exec(line)?.groups
  if (!match) {
    return undefined
  }
  return {
    type: 'connect to port',
    to_port: match.to_port,
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

  if (!server.ports[portAction.to_port]) {
    return { log: `ERROR: connecting to non-existent port ${portAction.to_port}` }
  }

  if (playerAI.current_port === portAction.to_port) {
    return { log: `tried to connect to port ${portAction.to_port}; already connected` }
  }

  return {
    log: `connect to port ${portAction.to_port}`,
    server: incrementActionUses(portAction, server),
    playerAI: { ...playerAI, current_port: portAction.to_port }
  }
}
