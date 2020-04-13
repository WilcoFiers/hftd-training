import { Plans, Threat, ThreatStep, Command } from './types';
import { header, tick_begin, tick_end, footer } from './data/report';

type MemberTick = { member: string; command: Command }[]
type ThreatTick = { threat: Threat, step: ThreatStep }[]

export function generate(server_name = 'unknown', plans: Plans, threats: Threat[], priorities: string[]): string {
  const threat_active_ticks: Threat[][] = []
  const context: string[] = [];
  const server = ''

  for (const threat of threats) {
    if (!threat_active_ticks[threat.start]) {
      threat_active_ticks[threat.start] = []
      threat_active_ticks[threat.start].push(threat)
    }
  }

  const member_ticks: MemberTick[] = []
  for (const member of priorities) {
    const plan = plans[member]
    for (const command of plan) {
      if (!member_ticks[command.tick]) {
        member_ticks[command.tick] = []
      }
      member_ticks[command.tick].push({ member, command })
    }
  }

  const threat_action_ticks: ThreatTick[] = []
  for (const threat of threats) {
    for (const [tick, step] of threat.steps.entries()) {
      if (!threat_action_ticks[tick]) {
        threat_action_ticks[tick] = []
      }
      threat_action_ticks[tick].push({ threat, step })
    }
  }

  const plan_length = Math.max(
    threat_action_ticks.length, 
    member_ticks.length, 
    threat_action_ticks.length
  )

  // jinja2.Template(self.__template.data["header"])
  context.push(header.render({ server, plan_length, server_name }).trim())

  for (let tick = 0; tick < plan_length; tick++) {
    // jinja2.Template(self.__template.data["tick_begin"])
    context.push(tick_begin.render({ server, tick }).trim())

    if (threat_active_ticks[tick]) {
      for (const threat of threat_active_ticks[tick]) {
        context.push(threat.report) // await threat.report.send(context.channel)
      }
    } else {
      context.push("No new active threats.")
    }

    let memberMessage = "";
    if (member_ticks[tick]) {
      for (const {member, command} of member_ticks[tick]) {
        memberMessage += `\n${member}: ${command.action}`
      }
    }

    if (memberMessage) {
      context.push(memberMessage.trim())
    } else {
      context.push("No member performed any actions.")
    }

    let threatMessage = ""
    if (tick in threat_action_ticks) {
      for (const { step, threat } of threat_action_ticks[tick]) {
          threatMessage += `${threat.name}: ${step.report(tick, threat)}`
      }
    }

    if (threatMessage) {
      context.push(`${threatMessage}`)
    } else {
      context.push("No threats active.")
    }
    // jinja2.Template(self.__template.data["tick_end"])
    context.push(tick_end.render({ server, tick }).trim())
  }
  // jinja2.Template(self.__template.data["footer"])
  context.push(footer.render({ server }).trim())

  return context.join('\n')
}
