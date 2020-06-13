import { TickSubstep } from '../types'
import { findAllowedPortAction, incrementActionUses, lineParser } from '../utils'

export type LinkQPUsAction = {
  type: 'link QPUs',
  toPort?: string
  fromPort?: string
  QPUs?: number
  tickTimit?: number
  hackLimit?: number
}

export type LinkQPUsPortAction = LinkQPUsAction & {
  QPUs: number,
  toPort: string
}

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
  const toPort = portAction.toPort
  const port = server.ports[toPort];
  const qpuCurrent = Math.min(port.qpuMax, port.qpuCurrent + portAction.QPUs)
  const newQPUs = qpuCurrent - port.qpuCurrent
  
  let log = `linked ${newQPUs} QPU${ portAction.QPUs === 1 ? '' : 's'} to port ${toPort}`
  if (port.qpuCurrent + portAction.QPUs > port.qpuMax) {
    log += `; port has no space for ${portAction.QPUs} additional QPUs`
  }
  server = incrementActionUses(portAction, {
    ...server,
    ports: {
      ...server.ports,
      [toPort]: {
        ...port,
        qpuCurrent
      }
    }
  })
  return { log, server }
}
