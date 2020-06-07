import runServerHack from '../runServerHack'
import { server, threats, playerAIs } from './data/advancedHack'

describe('runServerHack', () => {
  describe('advanced hack', () => {
    const goodOutput = runServerHack({ server, threats, playerAIs: [playerAIs[0]] })
    // const badOutput = runServerHack({ server, threats, playerAIs: [playerAIs[1]] })
  
    test('is the correct length', () => {
      // expect(badOutput).toHaveLength(10);
      expect(goodOutput).toHaveLength(10);
    })

    test('gets a new threat on tick 1', () => {
      const { newThreats } = goodOutput[1]
      expect(newThreats).toHaveLength(1)
    })

    test('heals 2 damage on tick 2', () => {
      const { threatActions } = goodOutput[2]
      expect(threatActions).toHaveLength(1)
      expect(threatActions[0]).toContain('heals 2 damage.')
    })

    test('takes 2 damage on tick 2, 3 and 4', () => {
      const { playerDamage: tick2Damage } = goodOutput[2]
      const { playerDamage: tick3Damage } = goodOutput[3]
      const { playerDamage: tick4Damage } = goodOutput[4]

      expect(tick2Damage[0]).toContain('2 health left')
      expect(tick3Damage[0]).toContain('2 health left')
      expect(tick4Damage[0]).toContain('destroyed')
    })
  })
})