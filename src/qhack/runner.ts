import { server, threats, playerAIs } from './data/basic-run1'
import runServerHack from './runServerHack'
import createAAR from './createAAR'

const report = runServerHack({ server, threats, playerAIs })
const aar = createAAR(report)

console.log(aar)