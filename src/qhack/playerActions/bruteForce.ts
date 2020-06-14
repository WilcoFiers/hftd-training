import { TickSubstep } from '../types'
import { findAllowedPortAction, incrementActionUses, lineParser } from '../utils'

export const type = 'brute force'

export type BruteForceAction = {
  type: 'brute force'
  securitySystem?: number | 'all',
  damage?: number
  qpuCost?: number
  fromPort?: string
  tickTimit?: number
  hackLimit?: number
  bonusDamage?: number
}

export type BruteForcePortAction = BruteForceAction & {
  securitySystem: number | 'all',
  damage: number,
  fromPort: string,
}

export const parser = (line: string): BruteForceAction | undefined => {
  const bruteForceRegex = /^((?<special>[!])\s*)?(brute\s*)?force(?<all>\s+all)?(\s+sec(urity)?)?(\s+sys(tems?)?)?(\s+(?<securitySystem>[0-9a-z]+))?/i
  // const bruteForceRegex = new RegExp(
  //   // "brute force ", "force " "bruteforce " 
  //   '^(brute\\s*)?force' +
  //   // "all", ""
  //   '(?<all>\\s+all)?' +
  //   // "security system ","security sys", "security systems", "", "sec sys"
  //   '(\\s+sec(urity)?)?(\\s+sys(tems?)?)?' +
  //   // "1", "one", ""
  //   '(\\s+(?<securitySystem>[0-9a-z+,&]+))?',
  //   // Flags:
  //   'i'
  // )
  const bruteForceMatch = bruteForceRegex.exec(line)?.groups
  if (!bruteForceMatch) {
    return undefined
  }
  const baseAction: BruteForceAction = { type }
  if (bruteForceMatch.special === '!') {
    baseAction.bonusDamage = 3;
  }

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
  const costMatch = /costs\s+(?<qpuCost>[0-9]+)/gi.exec(line)?.groups
  if (costMatch) {
    baseAction.qpuCost = parseInt(costMatch.qpuCost)
  }

  // "port 1"
  const portMatch = /port\s+(?<fromPort>[0-9a-z]+)/i.exec(line)?.groups
  if (portMatch) {
    baseAction.fromPort = portMatch.fromPort
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
  const playerAction = { ...action } as BruteForceAction
  const { bonusDamage = 0 } = playerAction;
  delete playerAction.bonusDamage

  try {
    portAction = findAllowedPortAction(playerAction, playerAI, server) as BruteForcePortAction
  } catch (e) {
    return { log: e.message }
  }

  const portId = playerAI.currentPort as string
  const port = server.ports[portId]
  if (port.qpuCurrent < (portAction.qpuCost || 0)) {
    return { log: `tried to brute force; port ${portAction.fromPort} needs ${portAction.qpuCost} QPUs, but only has ${port.qpuCurrent}` }
  } else if (portAction.qpuCost) {
    server = {
      ...server,
      ports: {
        ...server.ports,
        [portId]: {
          ...port,
          qpuCurrent: port.qpuCurrent - portAction.qpuCost
        }
      }
    }
  }
  
  let damage = portAction.damage
  if (bonusDamage) {
    if (portAction.securitySystem === 'all') {
      damage += bonusDamage
    } else {
      const activeSystems = Object.values(server.activeSecurity)
      .reduce((sum, [threat]) => sum + (threat ? 1 : 0), 0)
      damage += Math.floor(bonusDamage / activeSystems) || 1
    }
  }

  Object.entries(server.activeSecurity)
  .forEach(([index, [threat]]) => {
    const num = parseInt(index)
    if (threat && [num, 'all'].includes(portAction.securitySystem)) {
      threat.tickDamage = damage + (threat.tickDamage || 0)
    }
  })

  const log = `brute forces ${
    portAction.securitySystem === 'all'
      ? 'all security systems'
      : 'security system ' + portAction.securitySystem
  }, dealing ${damage} damage`

  server = incrementActionUses(portAction, server)
  return { log, server }
}
