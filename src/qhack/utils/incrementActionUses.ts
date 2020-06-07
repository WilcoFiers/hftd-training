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
        tick_uses: (action.tick_uses || 0) + 1,
        hack_uses: (action.hack_uses || 0) + 1
      }
    })

    ports[portId] = { ...port, actions }
  })

  return { ...server, ports }
}

export default incrementActionUses
