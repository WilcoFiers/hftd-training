import { QuantumServer } from './types'
import quantumServers from './training-servers'

export const getServer = (serverName?: string): QuantumServer => {
  let qserver = quantumServers.find(qserver => qserver.name === serverName)
  if (!qserver) {
    qserver = quantumServers[0]
  }

  return {
    name: qserver.name || 'unknown',
    duration: qserver.duration || '10:00',
    hostId: '',
    welcome_message: qserver.welcome_message || '',
    scan_result: qserver.scan_result || '',
    finished_success: qserver.finished_success || '',
    finished_timeout: qserver.finished_timeout || '',
    threats: [],
    ports: []
  }
}

