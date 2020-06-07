import { TickSubstep, BruteForceAction, BruteForcePortAction } from '../types'
import { findAllowedPortAction, incrementActionUses, lineParser } from '../utils'

export const parser = (line: string): BruteForceAction | undefined => {
  const bruteForceRegex = new RegExp(
    // "brute force ", "force " "bruteforce " 
    '^(brute\\s*)?force' +
    // "all", ""
    '(?<all>\\s+all)?' +
    // "security system ","security sys", "security systems", ""
    '(\\s+security)?(\\s+sys(tems?)?)?' +
    // "1", "one", ""
    '(\\s+(?<securitySystem>[0-9a-z]+))?',
    // Flags:
    'i'
  )
  const bruteForceMatch = bruteForceRegex.exec(line)?.groups
  if (!bruteForceMatch) {
    return undefined
  }
  const baseAction: BruteForceAction = { type: 'brute force' }

  if (bruteForceMatch.all) {
    baseAction.securitySystem = 'all'
  } else if (bruteForceMatch.securitySystem) {
    baseAction.securitySystem = parseInt(bruteForceMatch.securitySystem)
  }
  // "1 damage"
  const damageMatch = /(?<damage>[0-9]+)\s+damage/gi.exec(line)?.groups
  if (damageMatch) {
    baseAction.damage = parseInt(damageMatch.damage)
  }

  // "Costs 1"
  const costMatch = /costs\s+(?<qpu_cost>[0-9]+)/gi.exec(line)?.groups
  if (costMatch) {
    baseAction.qpu_cost = parseInt(costMatch.qpu_cost)
  }

  // "port 1"
  const portMatch = /port\s+(?<from_port>[0-9a-z]+)/i.exec(line)?.groups
  if (portMatch) {
    baseAction.from_port = portMatch.from_port
  }

  return {
    ...baseAction,
    // spread into the object to avoid ending with an explicitly undefined prop
    ...lineParser.tickLimit(line),
    ...lineParser.hackLimit(line),
  }
}


export const runner: TickSubstep = ({ action, playerAI, server }) => {
  let portAction: BruteForcePortAction 
  try {
    portAction = findAllowedPortAction(action, playerAI, server) as BruteForcePortAction
  } catch (e) {
    return { log: e.message }
  }

  const portId = playerAI.current_port as string
  const port = server.ports[portId]
  if (port.qpu_current < (portAction.qpu_cost || 0)) {
    return { log: `tried to brute force; port ${portAction.from_port} needs ${portAction.qpu_cost} QPUs, but only has ${port.qpu_current}` }
  } else if (portAction.qpu_cost) {
    server = {
      ...server,
      ports: {
        ...server.ports,
        [portId]: {
          ...port,
          qpu_current: port.qpu_current - portAction.qpu_cost
        }
      }
    }
  }

  Object.entries(server.activeSecurity)
  .forEach(([index, [threat]]) => {
    const num = parseInt(index)
    if (threat && [num, 'all'].includes(portAction.securitySystem)) {
      threat.tickDamage = portAction.damage + (threat.tickDamage || 0)
    }
  })

  const log = `brute forces ${
    portAction.securitySystem === 'all'
      ? 'all security systems'
      : 'security system ' + portAction.securitySystem
  }, dealing ${portAction.damage} damage`

  server = incrementActionUses(portAction, server)
  return { log, server }
}
