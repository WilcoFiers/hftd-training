const numberMap: { [prop: string]: number } = {
  'one': 1,
  'two': 2,
  'three': 3,
  'four': 4,
  'five': 5,
  'six': 6,
  'seven': 7,
  'eight': 8,
  'nine': 9,
  'ten': 10,
}

export function tickLimit(line: string): {} | { tickTimit: number } {
  // "...one use per tick", "two user per tick"
  const wordRegex = /(?<word>one|two|three|four|five|six|seven|eight|nine|ten)\s+(user?s?|times)\s+per\s+tick/gi
  // const wordRegex = new RegExp(
  //   // "[numbers]"
  //   '(?<word>one|two|three|four|five|six|seven|eight|nine|ten)' +
  //   // " uses", " users", " times"
  //   '\s+(user?s?|times)' +
  //   // " per tick"
  //   '\s+per\s+tick',
  //   // Regex flags:
  //   'gi'
  // )
  const wordMatch = wordRegex.exec(line)?.groups
  if (wordMatch) {
    return { tickTimit: numberMap[wordMatch.word] }
  }
  // "2 uses per tick", "3 users per tick" "3 times per tick"
  const multiUseRegex = /(?<tickTimit>[0-9]+)\s+(user?s?|times)\s+per\s+tick/gi
  const multiUseMatch = multiUseRegex.exec(line)?.groups
  if (multiUseMatch) {
    return { tickTimit: parseInt(multiUseMatch.tickTimit) }
  }
  return {}
}

export function hackLimit(line: string): {} | { hackLimit: number } {
  // "...one use per hack...", "...five uses per hack..."
  const wordRegex = /(?<word>one|two|three|four|five|six|seven|eight|nine|ten)\s+(user?s?|times?)\s+per\s+hack/gi
  // const wordRegex = new RegExp(
  //   // "[numbers]"
  //   '(?<word>one|two|three|four|five|six|seven|eight|nine|ten)' +
  //   // " use per hack", " uses per hack", " time per hack", " times per hack"
  //   '\s+(user?s?|times?)\s+per\s+hack' +
  //   // Regex flags:
  //   'gi'
  // )
  const wordMatch = wordRegex.exec(line)?.groups
  if (wordMatch) {
    return { hackLimit: numberMap[wordMatch.word] }
  }
  // "2 uses per hack", "3 uses per hack" "3 times per hack"
  const multiUseRegex = /(?<hackLimit>[0-9]+)\s+(uses?|times)\s+per\s+hack/gi
  const multiUseMatch = multiUseRegex.exec(line)?.groups
  if (multiUseMatch) {
    return { hackLimit: parseInt(multiUseMatch.hackLimit) }
  }
  return {}
}

export function fromPort(line: string): {} | { fromPort: string} {
  // "...from port 1...", "...from 1..."
  const fromRegex = /from(\s+port)\s+(?<fromPort>[0-9]+)/gi
  const fromMatch = fromRegex.exec(line)?.groups
  if (!fromMatch) {
    return {}
  }
  return { fromPort: fromMatch.fromPort }
}

export function toPort(line: string): {} | { toPort: string} {
  // "...to port 1...", "...to 1..."
  const fromPort = /to(\s+port)\s+(?<toPort>[0-9]+)/gi
  const toMatch = fromPort.exec(line)?.groups
  if (!toMatch) {
    return {}
  }
  return { toPort: toMatch.toPort }
}

export default { fromPort, toPort, tickLimit, hackLimit }
