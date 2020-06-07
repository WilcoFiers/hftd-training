// @ts-ignore // TDDO: define this type
import partialCompare from 'partial-compare'
import { ActivePlayerAI, PlayerAction, ActiveServer, PortAction } from "@/qhack/types";


function findAllowedPortAction (
  playerAction: PlayerAction,
  playerAI: ActivePlayerAI,
  server: ActiveServer
): PortAction {
  let msg = `tried to ${playerAction.type}`
  if (playerAction.type === 'connect to port') {
    // @ts-ignore
    msg += ` ${playerAction.to_port}`
  }

  if (!playerAI.current_port) {
    throw new Error(`${msg}; AI not connected`);
  }

  const port = server.ports[playerAI.current_port]
  const portBruteForceActions = port.actions.filter(({ type }) => type === playerAction.type)
  if (portBruteForceActions.length === 0) {
    throw new Error(`${msg}; no ${playerAction.type} action on port ${playerAI.current_port}`);
  }

  const possibleActions = portBruteForceActions.filter(action => {
    return partialCompare(action, playerAction)
  })

  if (possibleActions.length === 0) {
    throw new Error(`${msg}; no matching ${playerAction.type} action found on port ${playerAI.current_port}`);
  } else if (possibleActions.length > 1) {
    throw new Error(`${msg}; multiple matching ${playerAction.type} actions found on port ${playerAI.current_port}`);
  }

  const portAction = possibleActions[0]
  if (portAction.hack_limit && (portAction.hack_uses || 0) >= portAction.hack_limit) {
    throw new Error(`${msg}; action can not be used again this hack`)
  } else if (portAction.tick_limit && (portAction.tick_uses || 0) >= portAction.tick_limit) {
    throw new Error(`${msg}; action can not be used again this tick`)
  }

  return portAction
}

export default findAllowedPortAction
