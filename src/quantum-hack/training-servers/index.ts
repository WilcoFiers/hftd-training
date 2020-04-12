import { QuantumServer } from '../types';

// @ts-ignore
import trainingServer1 from './beginner/training-server-1.yml';
// @ts-ignore
import trainingServer2 from './beginner/training-server-2.yml';
// @ts-ignore
import trainingServer3 from './beginner/training-server-3.yml';

// @ts-ignore
import emptyServer from './empty-server.yml'

export default [ trainingServer1, trainingServer2, trainingServer3, emptyServer ] as QuantumServer[]