import { PlayerAI, Server, Threat } from '../../types'

export const server: Server = {
  name: 'Advanced test server #1',
  description: `Port 1: (0/3 QPUs)
> Initial connect 1
> Link 4 QPU to port 2 (Maximum of 1 times per hack)

Port 2: (0/3 QPUs)
> Initial connect 2
> Brute force security system 1, 4 damage, costs 1 QPU

Nodes in Trace Route 1, 1/2`,
}

export const threats: Threat[] = [{
  name: 'Custom tracing program',
  startTick: 1,
  securitySystem: 1,
  traceRoute: '1',
  description: `At the start of {{start}}, Security System {{sys}} starts tracing you.
It needs 4 damage to be brute forced.`,
  plans: `- At the end of {{start }}, trace route {{route}} will lose 2 nodes`
  }]

export const playerAIs: PlayerAI[] = [{
    displayName: "AI 1",
    plans: `t0: initial connect 1
t1: link QPUs
t2: disconnect`
  }, {
    displayName: "AI 2",
    plans: `t0: initial connect 2
t1: brute force
t3: disconnect`
  }]
