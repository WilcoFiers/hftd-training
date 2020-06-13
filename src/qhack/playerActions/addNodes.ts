import { TickSubstep } from '../types'
import { findAllowedPortAction, incrementActionUses, lineParser } from '../utils'

export type AddNodesAction = {
  type: 'add nodes'
  addNodes?: number
  traceRoute?: string
  qpuCost?: number
  fromPort?: string
  tickTimit?: number
  hackLimit?: number
}

export type AddNodesPortAction = AddNodesAction & {
  addNodes: number,
  traceRoute: string,
  qpuCost: number,
  fromPort: string,
}

export const parser = (line: string): AddNodesAction | undefined => {
  // "Add 2 nodes to Trace Route 1, costs 1 QPU linked to Port 2"

  // "add...", "add node...", "add 3 nodes..."
  const addNodeRegex = /^add(\s+(?<addNodes>[0-9]+))?(\s+nodes)?/i
  const addNodeMatch = addNodeRegex.exec(line)?.groups
  if (!addNodeMatch) {
    return undefined
  }
  const baseAction: AddNodesAction = {type: 'add nodes'}
  if (addNodeMatch.addNodes) {
    baseAction.addNodes = parseInt(addNodeMatch.addNodes)
  }
  
  // "trace route 1", "route 2", "tr 3"
  const traceRouteMatch = /(tr|route)\s(?<traceRoute>[0-9a-z]+)/gi.exec(line)?.groups
  if (traceRouteMatch) {
    baseAction.traceRoute = traceRouteMatch.traceRoute
  }

  // "cost 1", "costs 2", "1 QPU", "3 QPUs"
  const costRegex = /costs\s(?<qpuCost>[0-9]+)/gi
  const qpuRegex = /(?<qpuCost>[0-9]+)\s+QPUs?/gi
  const qpuCostMatch = costRegex.exec(line)?.groups || qpuRegex.exec(line)?.groups
  if (qpuCostMatch) {
    baseAction.qpuCost = parseInt(qpuCostMatch.qpuCost)
  }

  // "port 1" (as in, linked to port 1, or from port 2)
  const portMatch = /port\s+(?<fromPort>[0-9a-z]+)/gi.exec(line)?.groups
  if (portMatch) {
    baseAction.fromPort = portMatch.fromPort
  }

  return {
    ...baseAction,
    // spread into the object to avoid ending with an explicitly undefined prop
    ...lineParser.tickLimit(line),
    ...lineParser.hackLimit(line),
  }
}

export const runner: TickSubstep = ({ action, playerAI, server }) => {
  let portAction: AddNodesPortAction 
  try {
    portAction = findAllowedPortAction(action, playerAI, server) as AddNodesPortAction
  } catch (e) {
    return { log: e.message }
  }

  const portId = portAction.fromPort
  const port = server.ports[portId]
  if (port.qpuCurrent < (portAction.qpuCost || 0)) {
    return { log: `tried to add trace route nodes; port ${portAction.fromPort} needs ${portAction.qpuCost} QPUs, but only has ${port.qpuCurrent}` }
  } else if (portAction.qpuCost) {
    server = {
      ...server,
      ports: {
        ...server.ports,
        [portId]: {
          ...port,
          qpuCurrent: port.qpuCurrent - portAction.qpuCost
        }
      }
    }
  }

  // Copy the server so we can edit without disruptions
  server = { ...server, traceRoutes: { ...server.traceRoutes } }
  let log: string;
  if (portAction.traceRoute !== 'all') {
    const traceRoute = server.traceRoutes[portAction.traceRoute]
    const nodes = Math.min(traceRoute.nodesMax, traceRoute.nodes + portAction.addNodes)
    log = `add ${portAction.addNodes} nodes to trace route ${portAction.traceRoute}`
    if (traceRoute.nodesMax < traceRoute.nodes + portAction.addNodes) {
      log += `; route only has space for ${nodes - traceRoute.nodes}`
    }
    server.traceRoutes[portAction.traceRoute] = { ...traceRoute, nodes }

  } else { // action.traceRoute === 'all'
    log = `add ${portAction.addNodes} node${portAction.addNodes !== 1 ? 's' : ''} to all trace route`
    Object.entries(server.traceRoutes)
    .forEach(([traceRouteId, traceRoute]) => {
      const nodes = Math.min(traceRoute.nodesMax, traceRoute.nodes + portAction.addNodes)
      if (traceRoute.nodesMax < traceRoute.nodes + portAction.addNodes) {
        log += `; route ${traceRouteId} only has space for ${nodes - traceRoute.nodes}`
      }
      server.traceRoutes[traceRouteId] = { ...traceRoute, nodes }
    })
  }

  server = incrementActionUses(portAction, server)
  return { log, server }
}
