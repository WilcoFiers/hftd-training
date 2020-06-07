import { PlayerAI, Server, Threat } from '../../types'

export const server: Server = {
  name: 'Training server #1',
  description: `Port 1: (1/3 QPUs)
> Initial connect
> Connect to port 2 <can only connect one user per tick>
> Brute force security system 1, 4 damage, costs 1 QPU linked to port 1
> Link 4 QPU to port 1 (Maximum of 1 times per hack)
> Redirect up to 3 QPU from port 1 to port 2
> Download data
> Upload data
> Edit data

Port 2, 2 QPUs
> Connect to port 2 <can only connect one user per tick>
> Brute force all security systems, 2 damage, costs 1 QPU linked to port 2
> Add 2 nodes to Trace Route 1, costs 1 QPU linked to Port 2
> Download data
> Upload data
> Edit data

Nodes in Trace Route 1, 5 of 9
Nodes in Trace Route 2 at the start: 5/7`,
}

export const threats: Threat[] = [{
  name: 'Custom tracing program',
  startTick: 1,
  securitySystem: 1,
  traceRoute: '1',
  description: `At the start of {{tick}}, Security System {{sys}} starts tracing you.
It needs 4 damage to be brute forced. It ignores the first 1 damage per tick`,
  plans: 
`- At the end of T{{start+1}}, trace route {{route}} will lose 3 nodes
> After 2 ticks trace route {{route}} will lose 3 nodes`
  }]

export const playerAIs: PlayerAI[] = [{
    displayName: "Harambe",
    plans: `t0: initial connect
t1: link QPUs
t2: redirect 2 QPUs to port 2
t3: bruteforce
t4: disconnect`
  }, {
    displayName: "Outrunner",
    plans:`t0: initial connect
t1: connect to port 2
t2: brute force
t3: download data
t4: add nodes
t5: disconnect`
  }]
