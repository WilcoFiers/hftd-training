type FirebaseTime = {
  seconds: number;
  nanoseconds: number
}

export type ThreatStep = {
  report(tick: number, threat: Threat): string
  time: number;
  action: string;
  value: number;
}

export type Threat = {
  name: string;
  start: number;
  report: string;
  health: number;
  initial: string;
  steps: ThreatStep[];
}

export type Command = {
  tick: number;
  action: string;
}

export type Plans = {
  [display_name: string]: Command[]
}

export type PortAction = {
  name: string,
  type: string,
  arguments: string[]
}

export type Port = {
  id: string,
  description: string,
  actions: PortAction[]
}

export type NewPlayer = {
  displayName: string;
  plans: string;
}

export type Player = NewPlayer & {
  id: string,
  joined: FirebaseTime,
  completeTime?: FirebaseTime,
}

export type QuantumServer = {
  id?: string,
  name: string,
  duration: string,
  hostId: string,
  startTime?: FirebaseTime,
  players?: Player[],
  welcome_message: string,
  scan_result: string,
  finished_success: string,
  finished_timeout: string,
  threats: Threat[],
  ports: Port[],
  report?: string
}
