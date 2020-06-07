import { playerActions } from '../playerActions'
import { TickStep, ActivePlayerAI, ActivePortMap, ActiveServer } from "../types"

const runPlayerActions: TickStep = ({ server, playerAIs, tickNum }) => {
  const logs: string[] = []
  const updatedPlayerAIs: ActivePlayerAI[] = []

  server = resetTickUses(server)
  
  playerAIs.forEach((playerAI) => {
    const action = playerAI.actions[tickNum] || { type: 'idle' }

    // No preprogrammed action
    if (!playerActions[action.type]) {
      logs.push(`${playerAI.displayName}: ${action.type}`)
      updatedPlayerAIs.push(playerAI)
      return
    }

    const tickUpdate = playerActions[action.type]({ action, server, playerAI })
    server = tickUpdate.server || server

    // Don't add players that got disconnected
    if (!tickUpdate.playerAI || !tickUpdate.playerAI.disconnected) {
      updatedPlayerAIs.push(tickUpdate.playerAI || playerAI)
    }

    if (tickUpdate.log) {
      logs.push(`${playerAI.displayName}: ${tickUpdate.log}`)
    }
  })

  return { logs, playerAIs: updatedPlayerAIs, server }
}

export default runPlayerActions

function resetTickUses(server: ActiveServer): ActiveServer {
  const ports: ActivePortMap = {}
  Object.entries(server.ports).forEach(([portId, port]) => {
    ports[portId] = {
      ...port,
      actions: port.actions.map(action => ({
        ...action,
        tick_uses: 0
      }))
    }
  })
  return { ...server, ports }
}