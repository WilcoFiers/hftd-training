import { ThreatActionMethod } from '../types'
import { haveDisconnected, getTickDelay } from '../utils'

export const type = 'heal damage'

export type HealDamageAction = {
  type: 'heal damage'
  tickDelay: number
  healing: number
}

export const parser = (line: string): HealDamageAction | undefined => {
  // "heal(s) 2 damage"
  const healDamageRegex = /heals?\s+(?<healing>[0-9]+)\s+damage/i
  const match = healDamageRegex.exec(line)?.groups
  if (!match) {
    return
  }
  
  const tickDelay = getTickDelay(line)
  const healing = parseInt(match.healing)

  // Check all of 'm parsed right
  if (!tickDelay || isNaN(healing)) {
    return 
  }
  return { type, tickDelay, healing }
}

export const runner: ThreatActionMethod = ({ action, threat, server, playerAIs }) => {
  // Don't run after players have disconnected
  if (action.type !== type || haveDisconnected(playerAIs)) {
    return {}
  }
  const { health, healthMax } = threat
  if (!health || !healthMax) {
    return { log: `ERROR: can not heal program without health`}
  }
  const healing = Math.min(healthMax - health, action.healing)
  if (healing === 0) {
    return {}
  }
  const activeSecurity = { ...server.activeSecurity }
  Object.entries(server.activeSecurity).forEach(([securitySys, activeThreats]) => {
    if (!activeThreats.includes(threat)) {
      return
    }
    activeSecurity[securitySys as any] = activeThreats.map(activeThreat => {
      if (activeThreat !== threat) {
        return activeThreat
      }
      return { ...threat, health: health + healing }
    })
  })

  return {
    log: `heals ${healing} damage.`,
    server: { ...server, activeSecurity }
  }
}
