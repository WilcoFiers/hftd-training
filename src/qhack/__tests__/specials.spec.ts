import runServerHack from '../runServerHack'
import { server, threats, playerAIs } from './data/specials'

describe('runServerHack', () => {
  describe('special characters', () => {
    const hackOutput = runServerHack({ server, threats, playerAIs })

    test('destroys the first threat on tick 1', () => {
      const { playerDamage } = hackOutput[1]
      expect(playerDamage).toHaveLength(1)
      expect(playerDamage[0]).toContain('destroyed')
    })

    test('disconnects on T2', () => {
      const { playerActions } = hackOutput[2]
      expect(playerActions).toHaveLength(1)
      expect(playerActions[0]).toContain('disconnected')
    })

    test('it loses nodes after disconnect', () => {
      const { threatActions } = hackOutput[3]
      expect(threatActions).toHaveLength(1)
      expect(threatActions[0]).toContain('loses 2 nodes')
    })
  })
})