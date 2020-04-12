import { Command } from './types'

const tickFormat = /^t?([0-9]+)[:;.,]? (.*)$/i

export const parseCommand = (input: string): Command => {
  input = input.toLowerCase().trim()
  const match = input.match(tickFormat);

  if (!match) {
    throw new Error(`Command "${input}" does not have a valid format.`)
  }

  const [, tickStr, action] = match;
  const tick = parseInt(tickStr)
  if (isNaN(tick)) {
    throw new Error(`Unable to process tick "${match[1]}", expecting a whole number`)
  }

  if (tick < 0 || tick > 99) {
    throw new Error(`Tick ${tick} out of range in "${input}"`)
  }

  if (action.match(tickFormat)) {
    throw new Error(`Multiple ticks specified in "${input}"`)
  }

  return { tick, action }
}

export const parseCommands = (commandsStr: string): Command[] => {
  const commands: Command[] = []
  const ticks: boolean[] = []

  // Referse to the last entered command takes priority
  const commandStrs = commandsStr.split('\n').reverse()

  commandStrs.forEach(commandStr => {
    try {
      const command = parseCommand(commandStr);
      if (!ticks[command.tick]) { // Only one command per tick per user
        commands.push(command)
        ticks[command.tick] = true
      }
    } catch (e) {
      console.error(e)
    }
  })
  return commands
}
