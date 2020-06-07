import { TickSubstep, LinkQPUsAction, LinkQPUsPortAction } from '../types'
import { findAllowedPortAction, incrementActionUses, lineParser } from '../utils'

export const parser = (line: string): LinkQPUsAction | undefined => {
  // "link 4...", "Link 4..."
  const linkRegex = /^link(\s+(?<QPUs>[0-9]))?/i
  const linkMatch = linkRegex.exec(line)
  if (!linkMatch) {
    return undefined
  }

  const baseAction: LinkQPUsAction = { type: 'link QPUs' }
  if (linkMatch.groups?.QPUs) {
    baseAction.QPUs = parseInt(linkMatch.groups.QPUs)
  }

  return {
    ...baseAction,
    // spread into the object to avoid ending with an explicitly undefined prop
    ...lineParser.fromPort(line),
    ...lineParser.toPort(line),
    ...lineParser.tickLimit(line),
    ...lineParser.hackLimit(line),
  }
}

export const runner: TickSubstep = ({ action, server, playerAI }) => {
  let portAction: LinkQPUsPortAction
  try {
    portAction = findAllowedPortAction(action, playerAI, server) as LinkQPUsPortAction
  } catch (e) {
    return { log: e.message }
  }
  const toPort = portAction.to_port
  const port = server.ports[toPort];
  const qpu_current = Math.min(port.qpu_max, port.qpu_current + portAction.QPUs)
  const newQPUs = qpu_current - port.qpu_current
  
  let log = `linked ${newQPUs} QPU${ portAction.QPUs === 1 ? '' : 's'} to port ${toPort}`
  if (port.qpu_current + portAction.QPUs > port.qpu_max) {
    log += `; port has no space for ${portAction.QPUs} additional QPUs`
  }
  server = incrementActionUses(portAction, {
    ...server,
    ports: {
      ...server.ports,
      [toPort]: {
        ...port,
        qpu_current
      }
    }
  })
  return { log, server }
}
