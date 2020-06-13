import { ActivePortAction, ActiveServer, ActivePortMap } from "@/qhack/types"

function incrementActionUses(currentAction: ActivePortAction, server: ActiveServer): ActiveServer {
  const ports: ActivePortMap = {}
  Object.entries(server.ports).forEach(([portId, port]) => {
    const actions = port.actions.map(action => {
      if (action !== currentAction) {
        return action
      }
      return {
        ...action,
        tickUses: (action.tickUses || 0) + 1,
        hackUses: (action.hackUses || 0) + 1
      }
    })

    ports[portId] = { ...port, actions }
  })

  return { ...server, ports }
}

export default incrementActionUses
