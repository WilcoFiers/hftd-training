import * as traceRouteAttack from './traceRouteAttack'
import * as healDamage from './healDamage'
import { ThreatActionMethod, Threat } from '../types';

type ThreatActionMap = { [actionName: string]: ThreatActionMethod }

export type ThreatAction = 
  traceRouteAttack.TraceRouteAttackAction |
  healDamage.HealDamageAction

export const threatActions: ThreatActionMap = {
  [traceRouteAttack.type]: traceRouteAttack.runner,
  [healDamage.type]: healDamage.runner
}


export const threatActionParsers = [
  traceRouteAttack.parser,
  healDamage.parser
]

export function threatActionParser({ plans, traceRoute }: Threat): ThreatAction[] {
  if (!plans) {
    return []
  }
  if (traceRoute) {
    plans = plans.replace(/{{route}}/gi, traceRoute)
  }

  const actionLines = plans.split('\n')
    .filter(line => line.replace(/^[-*>]\s/, ''))

  const actions: ThreatAction[] = []
  actionLines.forEach(line => {
    for (const parser of threatActionParsers) {
      const threatAction = parser(line)
      if (threatAction) {
        return actions.push(threatAction)
      }
    }
  })
  return actions
}
