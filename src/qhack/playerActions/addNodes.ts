import { TickSubstep, AddNodesAction, AddNodesPortAction } from '../types'
import { findAllowedPortAction, incrementActionUses, lineParser } from '../utils'

export const parser = (line: string): AddNodesAction | undefined => {
  // "Add 2 nodes to Trace Route 1, costs 1 QPU linked to Port 2"

  // "add...", "add node...", "add 3 nodes..."
  const addNodeRegex = /^add(\s+(?<add_nodes>[0-9]+))?(\s+nodes)?/i
  const addNodeMatch = addNodeRegex.exec(line)?.groups
  if (!addNodeMatch) {
    return undefined
  }
  const baseAction: AddNodesAction = {type: 'add nodes'}
  if (addNodeMatch.add_nodes) {
    baseAction.add_nodes = parseInt(addNodeMatch.add_nodes)
  }
  
  // "trace route 1", "route 2", "tr 3"
  const traceRouteMatch = /(tr|route)\s(?<traceRoute>[0-9a-z]+)/gi.exec(line)?.groups
  if (traceRouteMatch) {
    baseAction.traceRoute = traceRouteMatch.traceRoute
  }

  // "cost 1", "costs 2", "1 QPU", "3 QPUs"
  const costRegex = /costs\s(?<qpu_cost>[0-9]+)/gi
  const qpuRegex = /(?<qpu_cost>[0-9]+)\s+QPUs?/gi
  const qpuCostMatch = costRegex.exec(line)?.groups || qpuRegex.exec(line)?.groups
  if (qpuCostMatch) {
    baseAction.qpu_cost = parseInt(qpuCostMatch.qpu_cost)
  }

  // "port 1" (as in, linked to port 1, or from port 2)
  const portMatch = /port\s+(?<from_port>[0-9a-z]+)/gi.exec(line)?.groups
  if (portMatch) {
    baseAction.from_port = portMatch.from_port
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

  const portId = portAction.from_port
  const port = server.ports[portId]
  if (port.qpu_current < (portAction.qpu_cost || 0)) {
    return { log: `tried to add trace route nodes; port ${portAction.from_port} needs ${portAction.qpu_cost} QPUs, but only has ${port.qpu_current}` }
  } else if (portAction.qpu_cost) {
    server = {
      ...server,
      ports: {
        ...server.ports,
        [portId]: {
          ...port,
          qpu_current: port.qpu_current - portAction.qpu_cost
        }
      }
    }
  }

  // Copy the server so we can edit without disruptions
  server = { ...server, traceRoutes: { ...server.traceRoutes } }
  let log: string;
  if (portAction.traceRoute !== 'all') {
    const traceRoute = server.traceRoutes[portAction.traceRoute]
    const nodes = Math.min(traceRoute.nodes_max, traceRoute.nodes + portAction.add_nodes)
    log = `add ${portAction.add_nodes} nodes to trace route ${portAction.traceRoute}`
    if (traceRoute.nodes_max < traceRoute.nodes + portAction.add_nodes) {
      log += `; route only has space for ${nodes - traceRoute.nodes}`
    }
    server.traceRoutes[portAction.traceRoute] = { ...traceRoute, nodes }

  } else { // action.traceRoute === 'all'
    log = `add ${portAction.add_nodes} node${portAction.add_nodes !== 1 ? 's' : ''} to all trace route`
    Object.entries(server.traceRoutes)
    .forEach(([traceRouteId, traceRoute]) => {
      const nodes = Math.min(traceRoute.nodes_max, traceRoute.nodes + portAction.add_nodes)
      if (traceRoute.nodes_max < traceRoute.nodes + portAction.add_nodes) {
        log += `; route ${traceRouteId} only has space for ${nodes - traceRoute.nodes}`
      }
      server.traceRoutes[traceRouteId] = { ...traceRoute, nodes }
    })
  }

  server = incrementActionUses(portAction, server)
  return { log, server }
}
