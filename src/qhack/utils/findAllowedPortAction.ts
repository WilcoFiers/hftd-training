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
    msg += ` ${playerAction.toPort}`
  }

  if (!playerAI.currentPort) {
    throw new Error(`${msg}; AI not connected`);
  }

  const port = server.ports[playerAI.currentPort]
  const portBruteForceActions = port.actions.filter(({ type }) => type === playerAction.type)
  if (portBruteForceActions.length === 0) {
    throw new Error(`${msg}; no ${playerAction.type} action on port ${playerAI.currentPort}`);
  }

  const possibleActions = portBruteForceActions.filter(action => {
    return partialCompare(action, playerAction)
  })

  if (possibleActions.length === 0) {
    throw new Error(`${msg}; no matching ${playerAction.type} action found on port ${playerAI.currentPort}`);
  } else if (possibleActions.length > 1) {
    throw new Error(`${msg}; multiple matching ${playerAction.type} actions found on port ${playerAI.currentPort}`);
  }

  const portAction = possibleActions[0]
  if (portAction.hackLimit && (portAction.hackUses || 0) >= portAction.hackLimit) {
    throw new Error(`${msg}; action can not be used again this hack`)
  } else if (portAction.tickTimit && (portAction.tickUses || 0) >= portAction.tickTimit) {
    throw new Error(`${msg}; action can not be used again this tick`)
  }

  return portAction
}

export default findAllowedPortAction
