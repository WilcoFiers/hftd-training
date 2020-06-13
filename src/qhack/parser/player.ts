import { PlayerAI, ActivePlayerAI, PlayerAction } from '../types'
import { playerActionParser } from '../playerActions'

const playerAIDefaults = {
  currentPort: undefined,
  disconnected: false
}

function parsePlayer(playerAI: PlayerAI): ActivePlayerAI {
  // TODO: 
  // - automatically add connect / disconnect
  // - limit the length of the plan to the available actions
  const actionLines = parsePlan(playerAI.plans)
  const actions: PlayerAction[] = actionLines.map((actionLine) => {
    if (!actionLine) {
      return { type: 'idle' }
    }
    return playerActionParser(actionLine) || { type: actionLine }
  })
  
  return {
    ...playerAI,
    actions,
    ...playerAIDefaults
  }
}

export const parsePlan = (plan: string): (string | undefined)[] => {
  // Referse to the last entered command takes priority
  const splitPlan = plan.toLowerCase().split('\n').reverse()
  
  const actionLines: string[] = []
  splitPlan.forEach(commandStr => {
    const [tickNum, actionLine] = parsePlanLine(commandStr);
    if (!actionLines[tickNum]) { // Only one command per tickNum per user
      actionLines[tickNum] = actionLine
    }
  })
  return actionLines
}

export const parsePlanLine = (line: string): [number, string] => {
  line = line.trim()
  const tickRegex = /^t?(?<tick>[0-9]+)[:;.,]?\s(?<actionString>.*)$/i
  const tickMatch = tickRegex.exec(line)?.groups;
  if (!tickMatch) {
    throw new Error(`Command "${line}" does not have a valid format.`)
  }
  return [parseInt(tickMatch.tick), tickMatch.actionString]
}

export default parsePlayer
