import { PlayerAI, Server, Threat } from '../../types'

export const server: Server = {
  name: 'Advanced test server #1',
  description: `Port 1: (0/3 QPUs)
> Initial connect
> Brute force security system 1, 4 damage, costs 1 QPU
> Link 4 QPU to port 1 (Maximum of 1 times per hack)

Nodes in Trace Route 1, 5/9`,
}

export const threats: Threat[] = [{
  name: 'Custom tracing program',
  startTick: 1,
  securitySystem: 1,
  traceRoute: '1',
  description: `At the start of {{start}}, Security System {{sys}} starts tracing you.
It needs 4 damage to be brute forced. It ignores the first 2 damage per tick`,
  plans: 
`- At the end of {{start + 1}} this program will heal 8 damage.
- At the end of {{start + 2}} trace route {{route}} will lose 2 node(s)
- At the end of {{start + 3}} trace route {{route}} will lose 3 node(s).`
  }]

export const playerAIs: PlayerAI[] = [{
    displayName: "Good Harambe",
    plans: `t0: initial connect
t1: link QPUs
t2: brute force
t3: brute force
t4: brute force`
  }, {
    displayName: "Bad Harambe",
    plans: `t0: initial connect
t1: link QPUs
t2: brute force
t3: disconnect`
  }]
