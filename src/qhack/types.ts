import { ThreatAction } from './threatActions'
export { ThreatAction } from './threatActions'
import { PlayerAction, PortAction } from './playerActions'
export { PlayerAction, PortAction } from './playerActions'

export interface PlayerAI {
  displayName: string
  plans: string
}

export interface ActivePlayerAI extends PlayerAI {
  currentPort: string | undefined
  disconnected: boolean
  actions: PlayerAction[]
}

export interface Port {
  qpuStart?: number
  qpuMax?: number
  actions: PortAction[]
}
export type PortMap = { [portId: string]: Port }

export type ActivePortAction = PortAction & {
  tickUses?: number
  hackUses?: number
}

export interface ActivePort {
  qpuCurrent: number
  qpuMax: number
  actions: ActivePortAction[]
}
export type ActivePortMap = { [portId: string]: ActivePort }

export interface TraceRoute {
  nodesMax: number,
  nodes: number
}

export interface Threat {
  name: string,
  description: string,
  plans?: string
  startTick: number,
  securitySystem?: number,
  traceRoute?: string
}

export interface ActiveThreat extends Threat {
  actions: ThreatAction[],
  tickDamage: number,
  health?: number,
  healthMax?: number,
  damageReduction?: number,
}

export interface Server {
  name: string;
  description: string
  ticksMax?: number,
}

export interface ActiveServer extends Server {
  activeSecurity: {
    [securitySystem: number]: ActiveThreat[]
  },
  ports: ActivePortMap
  ticksMax: number,
  threats: ActiveThreat[],
  traceRoutes: { [routeId: string]: TraceRoute },
  status?: 'success' | 'failed' | 'timeout',
}

export type TickArguments = {
  action: PlayerAction
  server: ActiveServer
  playerAI: ActivePlayerAI
}

export type TickSubstep = (arg: TickArguments) => Partial<TickArguments> & { log?: string }

type ThreatActionArgs = {
  server: ActiveServer
  playerAIs: ActivePlayerAI[]
  action: ThreatAction
  threat: ActiveThreat
}

export type ThreatActionMethod = (arg: ThreatActionArgs) => Partial<ThreatActionArgs> & { log?: string }

type TickStepArgs = {
  server: ActiveServer
  playerAIs: ActivePlayerAI[]
  tickNum: number
}

export type TickStep = (arg: TickStepArgs) => Partial<TickStepArgs> & { logs: string[]}

export interface TickLog {
  newThreats: string[]
  playerActions: string[]
  playerDamage: string[]
  threatActions: string[]
  serverStatus: string[]
}

export interface Hack {
  server: Server,
  playerAIs: PlayerAI[],
  threats: Threat[]
}
