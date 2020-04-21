// @ts-ignore
import trainingServer1 from './training-server-1.yml';
// @ts-ignore
import trainingServer2 from './training-server-2.yml';
// @ts-ignore
import trainingServer3 from './training-server-3.yml';
import { QuantumServer } from '../../types'

export default {
  name: 'Beginner Servers',
  servers: [trainingServer1, trainingServer2, trainingServer3] as QuantumServer[]
}