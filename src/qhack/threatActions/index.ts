import * as traceRouteAttack from './traceRouteAttack'
import { ThreatActionMethod, Threat, ThreatAction } from '../types';

type ThreatActionMap = { [actionName: string]: ThreatActionMethod }

export const threatActions: ThreatActionMap = {
  [traceRouteAttack.type]: traceRouteAttack.runner
}

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
    const action = traceRouteAttack.parser(line)
    if (action) {
      actions.push(action)
    }
  })
  return actions
}
