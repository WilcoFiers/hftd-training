import { TickStep } from "../types"

const processPlayerDamage: TickStep = ({ server, tickNum, playerAIs }) => {
  const logs: string[] = []
  server = {
    ...server,
    activeSecurity: { ...server.activeSecurity }
  }
  
  Object.entries(server.activeSecurity).forEach(([index, threats]) => {
    const num = parseInt(index)
    const threat = threats[0]
    if (!threat || !threat.tickDamage || threat.health === undefined) {
      return;
    }
    console.log('Damage is wrong, if atk 1 destroys, atk 2 goes to the second threat')
    const damage = Math.max(0, threat.tickDamage - (threat.damage_reduction || 0))
    let log = `${threat.name} takes ${damage} damage`
    if (threat.damage_reduction && threat.damage_reduction > 0) {
      log += ` (ignoring ${Math.min(threat.damage_reduction, threat.tickDamage)})`
    }

    if (damage >= threat.health) {
      logs.push(log + ' and is destroyed!')
      server.activeSecurity[num] = threats.slice(1) // remove the threat

    } else {
      const health = threat.health - damage
      logs.push(log + `, ${health} health left`)

      server.activeSecurity[num] = [{
        ...threat,
        health,
        tickDamage: 0
      }, ...threats.slice(1)]
    }
  })

  return { logs, server }
}

export default processPlayerDamage
