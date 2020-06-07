export default function getTickDelay(line: string): undefined | number {
  const afterTicks = /after\s(?<tickDelay>[0-9]+)\sticks?/i
  const atTick = /at\s+the\s+end\s+of\s(T|tick\s+)?{{\s*start\s*\+\s*(?<tickDelay>[0-9]+)\s*}}/i
  const match = afterTicks.exec(line) || atTick.exec(line)
  if (!match || !match.groups) {
    return
  }
  return parseInt(match.groups.tickDelay)
}
