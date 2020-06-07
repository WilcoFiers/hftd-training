import { Server, ActiveServer, ActivePortMap, TraceRoute } from '../types'
import { getPortMap } from './port'

const serverDefaults = {
  ticks_max: 10,
  activeSecurity: {}
}

function serverParser (server: Server): ActiveServer {
  const ports = getActivePorts(server)
  const [initial_port = '1'] = Object.entries(ports).find(([, port]) => {
    port.actions.some(({ type }) => type === 'initial connect')
  }) || []

  return {
    initial_port,
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
      qpu_current: port.qpu_start || 0,
      qpu_max: Infinity,
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
    const trRegex = /Nodes? in (Trace Route|TR) (?<routeId>[0-9]+)[,;\s].*(?<nodes>[0-9]+)\s?(\/|of)\s?(?<nodes_max>[0-9]+)/gi
    const match = trRegex.exec(line)?.groups
    if (!match) {
      continue;
    }
    const nodes = parseInt(match.nodes)
    const nodes_max = parseInt(match.nodes_max)
    if (isNaN(nodes) || isNaN(nodes_max)) {
      continue;
    }

    traceRoutes[match.routeId] = { nodes, nodes_max }
  }
  return traceRoutes
}
