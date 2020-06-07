import { PortMap, Port } from '../types'
import { portActionParser } from '../playerActions'

export function getPortMap (description: string): PortMap {
  const portMap: PortMap = {}
  const lines = description.split('\n')
  let currentPort: string | undefined
  
  lines.forEach(line => {
    let [portId, port] = parsePort(line)
    if (port && portId) {
      portMap[portId] = port
      currentPort = portId
      return
    }

    const actionLine = line.toLowerCase().match(/^[>\-*]\s(.*)$/)?.[1] || ''
    if (!actionLine.trim()) {
      // no more actions found, reset for the next port
      currentPort = undefined
      return;
    }

    let action = portActionParser(actionLine)
    if (currentPort && action) {
      portMap[currentPort].actions.push(action)
    }
  })
  return portMap
}

export function parsePort(portString: string): [string, Port] | [] {
  // port 1 ...
  const portRegex = /^\s*port\s(?<portId>[0-9a-z]+)/gi
  const portMatch = portRegex.exec(portString)?.groups
  if (!portMatch) {
    return [] // not a port
  }
  const { portId } = portMatch
  let port: Port = { actions: [] }

  // ... 0 / 1 QPUs ... OR: 1 QPU
  const qpuRegex = /(?<qpu_start>[0-9]+)(\s?(\/|of)\s?(?<qpu_max>[0-9]+))?\s?QPUs?/gi
  const qpuMatch = qpuRegex.exec(portString)?.groups
  if (qpuMatch) {
    const qpu_start = parseInt(qpuMatch.qpu_start)
    if (!isNaN(qpu_start)) {
      port.qpu_start = qpu_start
    }

    const qpu_max = parseInt(qpuMatch.qpu_max)
    if (!isNaN(qpu_max)) {
      port.qpu_max = qpu_max
    }
  }

  return [portId, port]
}
