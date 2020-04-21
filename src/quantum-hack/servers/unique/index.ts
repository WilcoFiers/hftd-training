// @ts-ignore
import Bratva from './Bratva.yml';
// @ts-ignore
import MintyClean from './MintyClean.yml';
import { QuantumServer } from '../../types'

console.log(Bratva)

export default {
  name: 'Unique Servers',
  servers: [Bratva, MintyClean] as QuantumServer[]
}