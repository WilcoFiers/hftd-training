import { TickStep, ThreatAction, ActiveThreat, ActiveServer } from "../types"
import { threatActions } from '../threatActions'

type TickThreataction = { action: ThreatAction, threat: ActiveThreat }

/* Get all { threat, actions } happening this tick */
function getTickThreatActions(server: ActiveServer, tickNum: number): TickThreataction[] {
  const actions: TickThreataction[] = [];
  Object.values(server.activeSecurity).forEach((threats) => {
    threats.forEach(threat => {
      threat.actions.forEach(action => {
        if (threat.startTick + action.tickDelay === tickNum) { 
          actions.push({ action, threat })
        }
      })
    })
  })
  return actions
}

const runThreatActions: TickStep = ({ server, tickNum, playerAIs }) => {
  const logs: string[] = []
  const tickActions = getTickThreatActions(server, tickNum)

  tickActions.forEach(({ threat, action }) => {
    const threatAction = threatActions[action.type]
    if (!threatAction) {
      logs.push(`${threat.name}: ${action.type }`)
      return
    }
  
    const tickUpdate = threatAction({ action, threat, server, playerAIs })
    if (tickUpdate.log) {
      logs.push(`${threat.name}: ${tickUpdate.log}`)
    }
    server = tickUpdate.server || server
    playerAIs = tickUpdate.playerAIs || playerAIs
  })
  return { logs, server, playerAIs }
}

export default runThreatActions
