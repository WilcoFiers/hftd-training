import { QuantumServer } from './types'
import quantumServers, { emptyServer } from './servers'

const serverList: QuantumServer[] = []
quantumServers.forEach((serverGroup) => serverList.push(...serverGroup.servers))

export const getServer = (serverName?: string): QuantumServer => {
  let qserver = serverList.find(qserver => qserver.name === serverName)
  if (!qserver) {
    qserver = emptyServer
  }

  return {
    name: qserver.name || 'unknown',
    duration: qserver.duration || '10:00',
    hostId: '',
    welcome_message: qserver.welcome_message || '',
    scan_result: qserver.scan_result || '',
    finished_success: qserver.finished_success || '',
    finished_timeout: qserver.finished_timeout || '',
    threats: qserver.threats || [],
    ports: qserver.ports || []
  }
}

