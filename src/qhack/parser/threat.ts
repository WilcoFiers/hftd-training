import { Threat, ActiveThreat } from '../types'
import { threatActionParser } from '../threatActions'

function threatParser (threat: Threat): ActiveThreat {
  const activeThreat: ActiveThreat = {
    ...threat,
    tickDamage: 0,
    description: getDescription(threat),
    actions: threatActionParser(threat)
  }

  const health = getThreatHealth(threat)
  if (health) {
    activeThreat.health = health
    activeThreat.healthMax = health
  }
  
  const damageReduction = getDamageReduction(threat)
  if (damageReduction) {
    activeThreat.damageReduction = damageReduction
  }
  return activeThreat
}

export default threatParser

export function getDescription(threat: Threat): string {
  return threat.description
    .replace('{{tick}}', `T0${threat.startTick}`)
    .replace('{{start}}', `T0${threat.startTick}`)
    .replace('{{sys}}', String(threat.securitySystem))
}

export function getThreatHealth({ description }: Threat): number | undefined {
  const healthRegex = /(?<health>[1-9]+)(\sdamage)?\sto(\sbe)?\s(destroy(ed)?|brute\sforced?)/ig
  const out = healthRegex.exec(description)
  if (!out) {
    return
  }
  return parseInt(out.groups?.health || '0')
}

export function getDamageReduction({ description }: Threat): number | undefined {
  const ignoreRegex = /ignore(s|ing)\sthe\sfirst\s(?<ignore>[0-9]+)\sdamage\s(per|each)\stick/
  const out = ignoreRegex.exec(description)
  if (!out) {
    return
  }
  return parseInt(out.groups?.ignore || '0')
}
