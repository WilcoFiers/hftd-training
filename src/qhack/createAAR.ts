import { TickLog } from './types';

export default function createAAR(tickLogs: TickLog[]): string {
  let ticks: string[] = []
  const reveseLogs = tickLogs.concat().reverse()

  // Start at the end:
  reveseLogs.forEach((tickLog, index) => {
    if (// Ignore ticks until we find one where stuff is happening:
      ticks.length === 0 &&
      tickLog.newThreats.length === 0 &&
      tickLog.playerActions.length === 0 &&
      tickLog.threatActions.length === 0
    ) {
      return;
    }
    const tickNum = reveseLogs.length - index - 1

    let newThreats = 'No new active threats.'
    if (tickLog.newThreats.length > 0) {
      newThreats = tickLog.newThreats.join('\n\n')
    }

    let tick = `/// ----------------------- TICK ${ tickNum } INI ----------------------- \\\\\\\n`
    if (tickLog.newThreats.length > 0) {
      tick += tickLog.newThreats.join('\n\n')+ '\n'
    }
    if (tickLog.playerActions.length > 0) {
      tick += tickLog.playerActions.join('\n')+ '\n'
    }
    if (tickLog.playerDamage.length > 0) {
      tick += tickLog.playerDamage.join('\n')+ '\n'
    }
    if (tickLog.threatActions.length > 0) {
      tick += tickLog.threatActions.join('\n')+ '\n'
    }
    if (tickLog.serverStatus.length > 0) {
      tick += tickLog.serverStatus.join('\n')+ '\n'
    }
    tick += `\\\\\\ ----------------------- TICK ${ tickNum } END ----------------------- ///`
    ticks.push(tick)
  })

  // Revere the logs again so it starts with tick 0 again:
  return ticks.reverse().join('\n')
}