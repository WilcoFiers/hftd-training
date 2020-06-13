import { TickSubstep } from '../types'
import { findAllowedPortAction, incrementActionUses, lineParser } from '../utils'

export type RedirectQPUsAction = {
  type: 'redirect QPUs',
  QPUs: number
  upTo?: boolean
  toPort?: string
  fromPort?: string
  tickTimit?: number
  hackLimit?: number
}

export type RedirectQPUsPortAction = RedirectQPUsAction & {
  fromPort: string
  toPort: string
  QPUs: number
  upTo: boolean
}

export const parser = (line: string): RedirectQPUsAction | undefined => {
  // "redirect 4...", "direct 4..."
  const linkRegex = /^(re)?direct(?<upTo>\s+up\s+to)?\s+(?<QPUs>[0-9])/i
  const linkMatch = linkRegex.exec(line)?.groups

  if (!linkMatch) {
    return undefined
  }

  const baseAction: RedirectQPUsAction = {
    type: 'redirect QPUs',
    QPUs: parseInt(linkMatch.QPUs)
  }
  if (linkMatch.upTo) {
    baseAction.upTo = true
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
  // Delete QPUs, as the number does not need to match the one one port
  const playerAction = { ...action } as RedirectQPUsAction
  const planQPUs = playerAction.QPUs
  delete playerAction.QPUs

  let portAction: RedirectQPUsPortAction
  try {
    portAction = findAllowedPortAction(playerAction, playerAI, server) as RedirectQPUsPortAction
  } catch (e) {
    return { log: e.message }
  }
  if (!portAction.upTo && planQPUs !== portAction.QPUs) {
    return { log: `tried to redirect ${planQPUs} QPUs; port only allows redirecting ${portAction.QPUs} QPUs` }
  } else if (planQPUs > portAction.QPUs) {
    return { log: `tried to redirect ${planQPUs} QPUs; port can not redirect more than ${portAction.QPUs} QPUs` }
  }

  // Grab ports
  const toPortId = portAction.toPort
  const fromPortId = portAction.fromPort
  const toPort = server.ports[toPortId];
  const fromPort = server.ports[fromPortId];

  // Compute changes to QPUs
  const redirectQPUs = Math.min(planQPUs, fromPort.qpuCurrent)
  const fromPortQPUs = fromPort.qpuCurrent - redirectQPUs
  const toPortQPUs = Math.min(toPort.qpuMax, toPort.qpuCurrent + redirectQPUs)

  let log = `redirected ${redirectQPUs} QPU${redirectQPUs !== 1 ? 's' : ''} from port ${fromPortId} to port ${toPortId}`
  if (planQPUs > fromPort.qpuCurrent) {
    log += `; port did not have ${planQPUs} QPUs`
  }

  server = incrementActionUses(portAction, {
    ...server,
    ports: {
      ...server.ports,
      [fromPortId]: { ...fromPort, qpuCurrent: fromPortQPUs },
      [toPortId]: { ...toPort, qpuCurrent: toPortQPUs }
    }
  })
  return { log, server }
}
