import { Server, ActiveServer, ActivePortMap, TraceRoute } from '../types'
import { getPortMap } from './port'

const serverDefaults = {
  ticksMax: 10,
  activeSecurity: {}
}

function serverParser (server: Server): ActiveServer {
  const ports = getActivePorts(server)
  return {
    threats: [],
    ports,
    traceRoutes: traceRouteParser(server),
    ...server,
    ...serverDefaults,
  }
}

export default serverParser

function getActivePorts(server: Server): ActivePortMap {
  const { description } = server
  const ports = getPortMap(description)

  const activePorts: ActivePortMap = {}
  Object.entries(ports)
  .forEach(([key, port]) => {
    activePorts[key] = {
      qpuStart: port.qpuStart,
      qpuCurrent: port.qpuStart || 0,
      qpuMax: Infinity,
      ...port,
    }
  });
  return activePorts
}

type TraceRouteMap = { [routeId: string]: TraceRoute }

function traceRouteParser({ description }: Server): TraceRouteMap {
  const lines = description.split('\n')
  const traceRoutes: TraceRouteMap = {}
  for (const line of lines) {
    const trRegex = /Nodes? in (Trace Route|TR) (?<routeId>[0-9]+)[,;\s].*(?<nodes>[0-9]+)\s?(\/|of)\s?(?<nodesMax>[0-9]+)/gi
    const match = trRegex.exec(line)?.groups
    if (!match) {
      continue;
    }
    const nodes = parseInt(match.nodes)
    const nodesMax = parseInt(match.nodesMax)
    if (isNaN(nodes) || isNaN(nodesMax)) {
      continue;
    }

    traceRoutes[match.routeId] = { nodes, nodesMax }
  }
  return traceRoutes
}
