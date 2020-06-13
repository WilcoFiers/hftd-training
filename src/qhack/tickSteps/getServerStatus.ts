import { TickStep } from "../types"

const getServerStatus: TickStep = ({ server }) => {
  const logs: string[] = []
  let serverFail = false;
  Object.entries(server.traceRoutes)
  .forEach(([key, { nodes, nodesMax }]) => {
    logs.push(`Nodes in trace route ${key}: ${nodes}/${nodesMax}`)
    if (nodes <= 0) {
      serverFail = true
    }
  })

  // Object.entries(server.ports)
  // .forEach(([key, port]) => {
  //   logs.push(`Port ${key} has ${port.qpuCurrent} QPUs`)
  // })

  if (serverFail) {
    server = {
      ...server,
      status: 'failed'
    }

    logs.push([
      '\n### CRITICAL ERROR ###',
      'Any uploads, downloads or edits are undone',
      'Evidence of server access destroyed',
      'AIs self destruct!'
    ].join('\n'))
  }

  return { logs, server }
}

export default getServerStatus
