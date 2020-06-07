// @ts-ignore
import Bratva from './Bratva.yml';
// @ts-ignore
import MintyClean from './MintyClean.yml';
import { QuantumServer } from '../../types'

export default {
  name: 'Unique Servers',
  servers: [Bratva, MintyClean] as QuantumServer[]
}