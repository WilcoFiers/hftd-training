import { TickSubstep } from '../types'
import { BasicAction } from './index'

export const parser = (line: string): BasicAction | undefined => {
  // "disconnect", "disconnected"
  const disconnectRegex = /^disconnect/i
  const match = disconnectRegex.exec(line)
  if (!match) {
    return undefined
  }
  return { type: 'disconnect' }
}

export const runner: TickSubstep = ({ playerAI }) => {
  return {
    log: `disconnected`,
    playerAI: {
      ...playerAI,
      disconnected: true
    }
  }
}
