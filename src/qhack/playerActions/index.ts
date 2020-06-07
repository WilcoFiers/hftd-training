import * as initialConnect from './initialConnect'
import * as disconnect from './disconnect'
import * as connectToPort from './connectToPort'
import * as bruteForce from './bruteForce'
import * as linkQPUs from './linkQPUs'
import * as redirectQPUs from './redirectQPUs'
import * as addNodes from './addNodes'
import { TickSubstep, PlayerAction, PortAction } from '../types';

type Actions = { [actionName: string]: TickSubstep }

export const playerActions: Actions = {
  'initial connect': initialConnect.runner,
  'disconnect': disconnect.runner,
  'connect to port': connectToPort.runner,
  'link QPUs': linkQPUs.runner,
  'redirect QPUs': redirectQPUs.runner,
  'brute force': bruteForce.runner,
  'add nodes': addNodes.runner,
}

export const playerActionParsers = [
  initialConnect.parser,
  disconnect.parser,
  connectToPort.parser,
  linkQPUs.parser,
  bruteForce.parser,
  redirectQPUs.parser,
  addNodes.parser,
]

export const playerActionParser = (line: string): PlayerAction | undefined => {
  for (const parser of playerActionParsers) {
    const playerAction = parser(line)
    if (playerAction) {
      return playerAction
    }
  }
  return undefined
}

export const portActionParser = (line: string): PortAction | undefined => {
  // TODO apply defaults to turn each action into a PortAction
  return playerActionParser(line) as PortAction | undefined 
}
