import { BasicAction, TickSubstep } from '../types'

export const parser = (line: string): BasicAction | undefined => {
  // "initial connect", "initial-connect" "initial"
  const initialRegex = /^initial(.+connect)?/i
  // "connect"
  const connectRegex = /^connect$/i
  const match = initialRegex.exec(line) || connectRegex.exec(line)
  if (!match) {
    return undefined
  }

  return { type: 'initial connect' }
}

export const runner: TickSubstep = ({ server, playerAI }) =>{
  if (playerAI.current_port) {
    return { log: `fails to connect, connection already initiated` }
  }
  return {
    log: `initial connect`,
    playerAI: {
      ...playerAI,
      current_port: server.initial_port
    }
  }
}
