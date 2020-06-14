import runServerHack from '../runServerHack'
import { server, threats, playerAIs } from './data/specials'

describe('runServerHack', () => {
  describe('special characters', () => {
    const hackOutput = runServerHack({ server, threats, playerAIs })

    test('gets a new threat on tick 1', () => {
      const { playerDamage } = hackOutput[1]
      expect(playerDamage).toHaveLength(1)
      expect(playerDamage[0]).toContain('destroyed')
    })
  })
})