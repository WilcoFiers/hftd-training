import { PlayerAI, Server, Threat } from '../../types'

export const server: Server = {
  name: 'Training server #1',
  description: `Port 1: (1/3 QPUs)
> Initial connect
> Connect to port 2 <can only connect one user per tick>
> Brute force security system 1, 1 damage

Nodes in Trace Route 1, 1/4`,
}

export const threats: Threat[] = [{
  name: 'Custom tracing program',
  startTick: 0,
  securitySystem: 1,
  traceRoute: '1',
  description: `At the start of {{tick}}, Security System {{sys}} starts tracing you.
It needs 4 damage to be brute forced.`,
  plans: `> After 1 ticks trace route loses 3 nodes`
  }]

export const playerAIs: PlayerAI[] = [{
    displayName: "Harambe",
    plans: `t0: initial connect
t1: !brute force
t2: disconnect`
  }]
