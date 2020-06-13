import { TickStep } from "../types"

const processPlayerDamage: TickStep = ({ server }) => {
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

    const damage = Math.max(0, threat.tickDamage - (threat.damageReduction || 0))
    let log = `${threat.name} takes ${damage} damage`
    if (threat.damageReduction && threat.damageReduction > 0) {
      log += ` (ignoring ${Math.min(threat.damageReduction, threat.tickDamage)})`
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
