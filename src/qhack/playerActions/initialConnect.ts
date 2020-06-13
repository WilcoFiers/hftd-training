import { TickSubstep } from '../types'

export type InitialConnectAction = {
  type: 'initial connect', 
  toPort?: string
  hackLimit?: number
  tickTimit?: number
}

export const type = 'initial connect'

export const parser = (line: string): InitialConnectAction | undefined => {
  // "initial connect", "initial-connect" "initial"
  const initialRegex = /^initial(\s+connect)?((\s+to\s+port)?\s+(?<toPort>[0-9]+))?/i
  // "connect"
  const connectRegex = /^connect$/i
  const match = initialRegex.exec(line) || connectRegex.exec(line)
  if (!match) {
    return undefined
  }

  const { toPort } = match?.groups || {}
  if (toPort) {
    return { type, toPort }
  } else {
    return { type }
  }
}

export const runner: TickSubstep = ({ server, playerAI, action }) =>{
  if (action.type !== type || playerAI.currentPort) {
    return { log: `fails to connect, connection already initiated` }
  }
  // @ts-ignore // don't know why this doesn't work
  let currentPort: string | undefined = action.toPort
  let log = ''

  if (currentPort) {
    const port = server.ports[currentPort]
    if (!port) {
      log = `failed to connect to unknown port ${currentPort}. `
      currentPort = undefined
    } else if (port.actions.every(a => a.type !== type)) {
      log = `Initial connect ${currentPort} unavailable. `
      currentPort = undefined
    }
  }

  if (!currentPort) {
    const initialPortIds = Object.entries(server.ports).filter(([, port]) => {
      return port.actions.some(action => action.type === type )
    }).map(([portId]) => portId).sort()

    if (initialPortIds.length === 0) {
      throw new Error(`Server must have at least 1 port with initial connect`)
    }
    if (initialPortIds.length > 1) {
      log += `Multiple ports available. `
    }
    currentPort = initialPortIds[0]
  }

  return {
    log: log + `Initial connect ${currentPort}`,
    playerAI: { ...playerAI, currentPort }
  }
}
