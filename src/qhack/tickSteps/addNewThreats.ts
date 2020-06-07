import { TickStep } from "../types"

const addNewThreats: TickStep = ({ server, tickNum }) => {
  const logs: string[] = []
  server.threats.forEach((threat) => {
    if (threat.startTick !== tickNum) {
      return 
    }

    logs.push(`### New Threat: ${threat.name} ###\n${threat.description}`)
    if (!threat.securitySystem) {
      return;
    }
    if (!server.activeSecurity[threat.securitySystem]) {
      server.activeSecurity[threat.securitySystem] = []
    }
    server.activeSecurity[threat.securitySystem].push(threat)        
  })

  return { logs }
}

export default addNewThreats
