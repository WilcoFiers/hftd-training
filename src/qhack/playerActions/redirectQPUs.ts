import { TickSubstep, RedirectQPUsPortAction, RedirectQPUsAction } from '../types'
import { findAllowedPortAction, incrementActionUses, lineParser } from '../utils'

export const parser = (line: string): RedirectQPUsAction | undefined => {
  // "redirect 4...", "direct 4..."
  const linkRegex = /^(re)?direct(?<up_to>\s+up\s+to)?\s+(?<QPUs>[0-9])/i
  const linkMatch = linkRegex.exec(line)?.groups

  if (!linkMatch) {
    return undefined
  }

  const baseAction: RedirectQPUsAction = {
    type: 'redirect QPUs',
    QPUs: parseInt(linkMatch.QPUs)
  }
  if (linkMatch.up_to) {
    baseAction.up_to = true
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
  if (!portAction.up_to && planQPUs !== portAction.QPUs) {
    return { log: `tried to redirect ${planQPUs} QPUs; port only allows redirecting ${portAction.QPUs} QPUs` }
  } else if (planQPUs > portAction.QPUs) {
    return { log: `tried to redirect ${planQPUs} QPUs; port can not redirect more than ${portAction.QPUs} QPUs` }
  }

  // Grab ports
  const toPortId = portAction.to_port
  const fromPortId = portAction.from_port
  const toPort = server.ports[toPortId];
  const fromPort = server.ports[fromPortId];

  // Compute changes to QPUs
  const redirectQPUs = Math.min(planQPUs, fromPort.qpu_current)
  const fromPortQPUs = fromPort.qpu_current - redirectQPUs
  const toPortQPUs = Math.min(toPort.qpu_max, toPort.qpu_current + redirectQPUs)

  let log = `redirected ${redirectQPUs} QPU${redirectQPUs !== 1 ? 's' : ''} from port ${fromPortId} to port ${toPortId}`
  if (planQPUs > fromPort.qpu_current) {
    log += `; port did not have ${planQPUs} QPUs`
  }

  server = incrementActionUses(portAction, {
    ...server,
    ports: {
      ...server.ports,
      [fromPortId]: { ...fromPort, qpu_current: fromPortQPUs },
      [toPortId]: { ...toPort, qpu_current: toPortQPUs }
    }
  })
  return { log, server }
}
