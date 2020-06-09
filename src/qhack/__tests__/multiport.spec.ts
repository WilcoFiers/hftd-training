import runServerHack from '../runServerHack'
import { server, threats, playerAIs } from './data/multiport'

describe('runServerHack', () => {
  describe('multi-port hack', () => {
    const hackOutput = runServerHack({ server, threats, playerAIs })

    test('connects to different ports on tick 0', () => {
      const { playerActions } = hackOutput[0]
      expect(playerActions).toHaveLength(2)
      expect(playerActions[0]).toContain('connect 1')
      expect(playerActions[1]).toContain('connect 2')
    })

    test('destroys the threat on tick 1', () => {
      const { playerDamage } = hackOutput[1]
      expect(playerDamage).toHaveLength(1)
      expect(playerDamage[0]).toContain('destroyed')
    })
  })
})