import { ThreatActionMethod } from '../types'
import { runAfterDisconnect, getTickDelay } from '../utils'

export const type = 'trace route attack'

export type TraceRouteAttackAction = {
  type: 'trace route attack'
  tick_delay: number
  traceRoute: number | 'all'
  remove_nodes: number
}

export const parser = (line: string): TraceRouteAttackAction | undefined => {
  // "route Y will lose Z nodes"
  const singleRouteRegex = /route\s(?<traceRoute>[0-9])\s(will\slose|loses)\s(?<remove_nodes>[0-9]+)\snode/i
  // "all trace routes will lose Y nodes"
  const allRouteRegex = /(?<traceRoute>all)(\strace)\sroutes(\swill)?\slose\s(?<remove_nodes>[0-9]+)\snode/i

  const match = singleRouteRegex.exec(line) || allRouteRegex.exec(line)
  if (!match || !match.groups) {
    return
  }
  
  const tick_delay = getTickDelay(line)
  const remove_nodes = parseInt(match.groups.remove_nodes)

  let traceRoute: number | 'all' 
  if (match.groups.traceRoute === 'all') {
    traceRoute = 'all'
  } else {
    traceRoute = parseInt(match.groups.traceRoute)
  }

  // Check all of 'm parsed right
  if (tick_delay === undefined || isNaN(remove_nodes) || (traceRoute !== 'all' && isNaN(traceRoute))) {
    return 
  }

  return { type, tick_delay, traceRoute, remove_nodes }
}

export const runner: ThreatActionMethod = ({ action, threat, server, playerAIs }) => {
  // Don't run after players have disconnected
  if (action.type !== type || !runAfterDisconnect({ playerAIs, threat })) {
    return {}
  }

  if (typeof action.remove_nodes !== 'number') {
    return { log: `ERROR: remove_nodes was not specified for "${threat.name}"` }
  }
  if (!action.traceRoute) {
    return { log: `ERROR: traceRoute must be specified for "${threat.name}"`}
  }
  if (action.traceRoute !== 'all' && !server.traceRoutes[action.traceRoute]) {
    return { log: `ERROR: Trace route "${action.traceRoute}" is not in the server` }
  }

  // Copy the server so we can edit without disruptions
  server = { ...server, traceRoutes: { ...server.traceRoutes } }

  if (action.traceRoute !== 'all') {
    const traceRoute = server.traceRoutes[action.traceRoute]
    server.traceRoutes[action.traceRoute] = {
      ...traceRoute,
      nodes: Math.max(0, traceRoute.nodes - (action.remove_nodes || 0)),
    }

  } else { // action.traceRoute === 'all'
    Object.entries(server.traceRoutes)
    .forEach(([traceRouteId, traceRoute]) => {
      server.traceRoutes[traceRouteId] = {
        ...traceRoute,
        nodes: Math.max(0, traceRoute.nodes - (action.remove_nodes || 0)),
      }
    })
  }
  
  const trText = action.traceRoute === 'all' ? 'all trace routes' : `trace route ${action.traceRoute}`
  const log = `${trText} loses ${action.remove_nodes} node${action.remove_nodes > 1 ? 's' : ''}.`
  return { log, server }
}
