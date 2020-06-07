export type BasicActionTypes = 
  'initial connect' | 
  'disconnect' | 
  'download data' | 
  'upload data' | 
  'edit data' | 
  'idle'

export type BasicAction = {
  type: BasicActionTypes
  tick_limit?: number
  hack_limit?: number
}

export type ConnectAction = {
  type: 'connect to port',
  to_port: string
  tick_limit?: number
  hack_limit?: number
}

export type BruteForceAction = {
  type: 'brute force'
  securitySystem?: number | 'all',
  damage?: number
  qpu_cost?: number
  from_port?: string
  tick_limit?: number
  hack_limit?: number
}

export type LinkQPUsAction = {
  type: 'link QPUs',
  to_port?: string
  from_port?: string
  QPUs?: number
  tick_limit?: number
  hack_limit?: number
}

export type RedirectQPUsAction = {
  type: 'redirect QPUs',
  QPUs: number
  up_to?: boolean
  to_port?: string
  from_port?: string
  tick_limit?: number
  hack_limit?: number
}

export type AddNodesAction = {
  type: 'add nodes'
  add_nodes?: number
  traceRoute?: string
  qpu_cost?: number
  from_port?: string
  tick_limit?: number
  hack_limit?: number
}

type PlayerActionTypes = BasicAction | 'connect to port' | 'brute force' | 'link QPUs' | 'redirect QPUs' | 'add nodes'
type UnknownAction = { type: Exclude<string, PlayerActionTypes> }

export type PlayerAction = 
  BasicAction | 
  ConnectAction | 
  BruteForceAction | 
  LinkQPUsAction | 
  RedirectQPUsAction | 
  AddNodesAction |
  UnknownAction

export interface PlayerAI {
  displayName: string
  plans: string
}

export interface ActivePlayerAI extends PlayerAI {
  current_port: string | undefined
  disconnected: boolean
  actions: PlayerAction[]
}

export type BruteForcePortAction = BruteForceAction & {
  securitySystem: number | 'all',
  damage: number,
  from_port: string,
}

export type LinkQPUsPortAction = LinkQPUsAction & {
  QPUs: number,
  to_port: string
}

export type RedirectQPUsPortAction = RedirectQPUsAction & {
  from_port: string
  to_port: string
  QPUs: number
  up_to: boolean
}

export type AddNodesPortAction = AddNodesAction & {
  add_nodes: number,
  traceRoute: string,
  qpu_cost: number,
  from_port: string,
}

export type PortAction = 
  BasicAction | ConnectAction | BruteForcePortAction | LinkQPUsPortAction | RedirectQPUsPortAction | AddNodesPortAction

export interface Port {
  qpu_start?: number
  qpu_max?: number
  actions: PortAction[]
}
export type PortMap = { [portId: string]: Port }

export type ActivePortAction = PortAction & {
  tick_uses?: number
  hack_uses?: number
}

export interface ActivePort {
  qpu_current: number
  qpu_max: number
  actions: ActivePortAction[]
}
export type ActivePortMap = { [portId: string]: ActivePort }

export interface TraceRoute {
  nodes_max: number,
  nodes: number
}

export type ThreatAction = {
  type: string
  tick_delay: number
  traceRoute?: number | 'all'
  remove_nodes?: number
}

export interface Threat {
  name: string,
  description: string,
  plans?: string
  startTick: number,
  securitySystem?: number,
  traceRoute?: string,
  afterDisconnect?: boolean,
}

export interface ActiveThreat extends Threat {
  actions: ThreatAction[],
  tickDamage: number,
  health?: number,
  damage_reduction?: number,
}

export interface Server {
  name: string;
  description: string
  ticks_max?: number,
}

export interface ActiveServer extends Server {
  activeSecurity: {
    [securitySystem: number]: ActiveThreat[]
  }
  initial_port: string
  ports: ActivePortMap
  ticks_max: number,
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
