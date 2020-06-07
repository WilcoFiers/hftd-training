import runServerHack from '../runServerHack'
import { server, threats, playerAIs } from './data/simpleHack'

describe('runServerHack', () => {
  describe('simple hack', () => {
    const hackOutput = runServerHack({ server, threats, playerAIs })

    test('is the correct length', () => {
      expect(hackOutput).toHaveLength(10);
    })

    test('gets a new threat on tick 1', () => {
      const { newThreats } = hackOutput[1]
      expect(newThreats).toHaveLength(1)
    })

    test('encounters damage reduction on tick 2', () => {
      const { playerDamage } = hackOutput[2]
      expect(playerDamage).toHaveLength(1)
      expect(playerDamage[0]).toContain('ignoring 1')
      expect(playerDamage[0]).toContain('3 health left')
    })

    test('destroys the threat on tick 3', () => {
      const { playerDamage } = hackOutput[3]
      expect(playerDamage).toHaveLength(1)
      expect(playerDamage[0]).toContain('destroyed')
    })

    test('has a node added on tick 4', () => {
      const { serverStatus: statusTick3 } = hackOutput[3]
      const { serverStatus: statusTick4 } = hackOutput[4]

      expect(statusTick3[0]).toContain('2/9')
      expect(statusTick4[0]).toContain('4/9')
    })

    test('has 1 disconnect on tick 5', () => {
      const { playerActions } = hackOutput[5]
      expect(playerActions).toHaveLength(1)
      expect(playerActions[0]).toContain('disconnected')
    })
  })
})