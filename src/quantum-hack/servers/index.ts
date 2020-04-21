import uniqueServers from './unique'
import beginnerServers from './beginner'

// @ts-ignore
import empty from './empty-server.yml'
import { QuantumServer } from '../types'

export const emptyServer: QuantumServer = empty
export default [ beginnerServers, uniqueServers ]
