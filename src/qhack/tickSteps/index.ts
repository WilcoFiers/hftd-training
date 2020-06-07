import { ActivePlayerAI, ActiveServer, TickLog, TickStep } from '../types'

import addNewThreats from './addNewThreats'
import runPlayerActions from './runPlayerActions'
import processPlayerDamage from './processPlayerDamage'
import runThreatActions from './runThreatActions'
import getServerStatus from './getServerStatus'

const tickSteps: [TickStep, keyof TickLog][] = [
  [addNewThreats, 'newThreats'],
  [runPlayerActions, 'playerActions'],
  [processPlayerDamage, 'playerDamage'],
  [runThreatActions, 'threatActions'],
  [getServerStatus, 'serverStatus']
]

export function runTick(tickNum: number, server: ActiveServer, playerAIs: ActivePlayerAI[]) {
  const tickLog: TickLog = { 
    newThreats: [],
    playerActions: [],
    playerDamage: [],
    threatActions: [],
    serverStatus: [],
  }

  tickSteps.forEach(([ tickStep, tickLogKey]) => {
    const tickOutput = tickStep({ server, tickNum, playerAIs })
    
    // Update playerAIs and server for the next step:
    playerAIs = tickOutput.playerAIs || playerAIs
    server = tickOutput.server || server

    // Set the log
    tickLog[tickLogKey] = tickOutput.logs
  })

  return { server, playerAIs, tickLog }
}
