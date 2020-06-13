import { PortMap, Port } from '../types'
import { portActionParser } from '../playerActions'

export function getPortMap (description: string): PortMap {
  const portMap: PortMap = {}
  const lines = description.split('\n')
  let currentPort: string | undefined
  
  lines.forEach(line => {
    const [portId, port] = parsePort(line)
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

    const action = portActionParser(actionLine)
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
  const port: Port = { actions: [] }

  // ... 0 / 1 QPUs ... OR: 1 QPU
  const qpuRegex = /(?<qpuStart>[0-9]+)(\s?(\/|of)\s?(?<qpuMax>[0-9]+))?\s?QPUs?/gi
  const qpuMatch = qpuRegex.exec(portString)?.groups
  if (qpuMatch) {
    const qpuStart = parseInt(qpuMatch.qpuStart)
    if (!isNaN(qpuStart)) {
      port.qpuStart = qpuStart
    }

    const qpuMax = parseInt(qpuMatch.qpuMax)
    if (!isNaN(qpuMax)) {
      port.qpuMax = qpuMax
    }
  }

  return [portId, port]
}
