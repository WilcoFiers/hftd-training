import { Hack, ActivePlayerAI, ActiveServer, TickLog } from './types'
import { runTick } from './tickSteps';
import { threatParser, serverParser, parsePlayer } from './parser';

export default function runServerHack({ server, threats, playerAIs }: Hack ): TickLog[] {
  // Apply defaults + add setup
  let activeServer: ActiveServer = {
    ...serverParser(server),
    threats: threats.map(threatParser)
  }

  let activePlayerAIs: ActivePlayerAI[] = playerAIs.map(parsePlayer)
  
  const tickLogs: TickLog[] = []
  for (let tickNum = 0; tickNum < activeServer.ticksMax; tickNum++) {
    const tickResult = runTick(tickNum, activeServer, activePlayerAIs)

    activeServer = tickResult.server
    activePlayerAIs = tickResult.playerAIs
    tickLogs.push(tickResult.tickLog)

    if (activeServer.status === 'failed') {
      break;
    }
  }

  return tickLogs
}
