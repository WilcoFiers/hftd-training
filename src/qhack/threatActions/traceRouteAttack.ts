import { ThreatActionMethod } from '../types'
import { haveDisconnected, getTickDelay } from '../utils'

export const type = 'trace route attack'

export type TraceRouteAttackAction = {
  type: 'trace route attack'
  tickDelay: number
  traceRoute: number | 'all'
  removeNodes: number
  afterDisconnect: boolean
}

export const parser = (line: string): TraceRouteAttackAction | undefined => {
  // "route Y will lose Z nodes"
  const singleRouteRegex = /route\s(?<traceRoute>[0-9])\s(will\slose|loses)\s(?<removeNodes>[0-9]+)\snode/i
  // "all trace routes will lose Y nodes"
  const allRouteRegex = /(?<traceRoute>all)(\strace)\sroutes(\swill)?\slose\s(?<removeNodes>[0-9]+)\snode/i

  const match = singleRouteRegex.exec(line) || allRouteRegex.exec(line)
  if (!match || !match.groups) {
    return
  }
  
  const tickDelay = getTickDelay(line)
  const removeNodes = parseInt(match.groups.removeNodes)

  let traceRoute: number | 'all' 
  if (match.groups.traceRoute === 'all') {
    traceRoute = 'all'
  } else {
    traceRoute = parseInt(match.groups.traceRoute)
  }

  // Check all of 'm parsed right
  if (tickDelay === undefined || isNaN(removeNodes) || (traceRoute !== 'all' && isNaN(traceRoute))) {
    return 
  }

  // "Even after all QAIs are disconnected" "Even if AIs disconnected"
  const afterDisconnectRegex = /even\s+(if|after)(\s+all)?\s+Q?AIs(\s+are|\s+have)?\s+disconnected/
  const afterDisconnect = afterDisconnectRegex.test(line)

  return { type, tickDelay, traceRoute, removeNodes, afterDisconnect }
}

export const runner: ThreatActionMethod = ({ action, threat, server, playerAIs }) => {
  // Don't run after players have disconnected
  if (action.type !== type || (haveDisconnected(playerAIs) && !action.afterDisconnect)) {
    return {}
  }

  if (typeof action.removeNodes !== 'number') {
    return { log: `ERROR: removeNodes was not specified for "${threat.name}"` }
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
      nodes: Math.max(0, traceRoute.nodes - (action.removeNodes || 0)),
    }

  } else { // action.traceRoute === 'all'
    Object.entries(server.traceRoutes)
    .forEach(([traceRouteId, traceRoute]) => {
      server.traceRoutes[traceRouteId] = {
        ...traceRoute,
        nodes: Math.max(0, traceRoute.nodes - (action.removeNodes || 0)),
      }
    })
  }
  
  const trText = action.traceRoute === 'all' ? 'all trace routes' : `trace route ${action.traceRoute}`
  const log = `${trText} loses ${action.removeNodes} node${action.removeNodes > 1 ? 's' : ''}.`
  return { log, server }
}
