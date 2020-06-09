import { TickSubstep, InitialConnectAction } from '../types'

export const type = 'initial connect'

export const parser = (line: string): InitialConnectAction | undefined => {
  // "initial connect", "initial-connect" "initial"
  const initialRegex = /^initial(\s+connect)?((\s+to\s+port)?\s+(?<to_port>[0-9]+))?/i
  // "connect"
  const connectRegex = /^connect$/i
  const match = initialRegex.exec(line) || connectRegex.exec(line)
  if (!match) {
    return undefined
  }

  const { to_port } = match?.groups || {}
  if (to_port) {
    return { type, to_port }
  } else {
    return { type }
  }
}

export const runner: TickSubstep = ({ server, playerAI, action }) =>{
  if (action.type !== type || playerAI.current_port) {
    return { log: `fails to connect, connection already initiated` }
  }
  // @ts-ignore // don't know why this doesn't work
  let current_port: string | undefined = action.to_port
  let log = ''

  if (current_port) {
    const port = server.ports[current_port]
    if (!port) {
      log = `failed to connect to unknown port ${current_port}. `
      current_port = undefined
    } else if (port.actions.every(a => a.type !== type)) {
      log = `Initial connect ${current_port} unavailable. `
      current_port = undefined
    }
  }

  if (!current_port) {
    const initialPortIds = Object.entries(server.ports).filter(([, port]) => {
      return port.actions.some(action => action.type === type )
    }).map(([portId]) => portId).sort()

    if (initialPortIds.length === 0) {
      throw new Error(`Server must have at least 1 port with initial connect`)
    }
    if (initialPortIds.length > 1) {
      log += `Multiple ports available. `
    }
    current_port = initialPortIds[0]
  }

  return {
    log: log + `Initial connect ${current_port}`,
    playerAI: { ...playerAI, current_port }
  }
}
