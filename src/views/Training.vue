<template>
  <div class="mx-md-n4 mt-md-n4 section-container section-column">
    <section class="input">
      <!-- toolbar -->
      <div class="d-flex justify-space-between toolbar">
        <div class="btn-bar">
          <v-btn @click="run" :disabled="!playerAICanPlan"><v-icon left>mdi-play</v-icon>Run</v-btn>
          <v-btn @click="reset" :disabled="!playerAICanPlan"><v-icon left>mdi-undo-variant</v-icon>Reset</v-btn>
        </div>
        <div class="flex-grow-1 flex-grow-1">
          <v-btn 
            v-for="(player, index) in quantumServer.players" 
            :key="index"
            :class="playerTabsActive[index] && 'primary--text active'"
            :aria-pressed="playerTabsActive[index] ? 'true' : 'false'"
            v-ripple="{ class: playerTabsActive[index] && 'primary--text' }"
            v-text="(playerIsHost(player) ? `[host] ` : '') + player.displayName"
            @click="togglePlayerTab(index)"
          />
        </div>
        <Timer v-if="quantumServer.endTime" :duration="quantumServer.endTime"  />
        <Timer 
          v-else
          :duration="quantumServer.duration" 
          :startTime="startTime"
          ref="timer"
          @timeout="createReport" 
        />
      </div>

      <div v-if="!startTime" class="flex-grow-1 d-flex flex-column justify-center align-center overflow-auto">
        <v-btn @click="addPlayerAI" v-if="!playerAI">Join as an AI</v-btn>
        <template v-if="isHost">
          <p class="mt-4">Others can join by going to the same URL:</p>
          <p>
            <TextCopy :text="currentURL" />
          </p>
          <v-btn @click="initiate" :disabled="!quantumServer.players || !this.quantumServer.players.length ">~initiate server scan</v-btn>
        </template>
        <template v-else>
          <p>Waiting for the host to initiate server scan</p>
          <v-btn @click="removePlayerAI">Remove my AI</v-btn>
        </template>
      </div>
      <div v-else class="flex-grow-1 d-flex">
        <div v-for="(player, index) in activePlayerTabs" :key="index" class="content">
          <textarea 
            v-if="player === playerAI"
            :readonly="!playerAICanPlan"
            v-model="playerPlans"
            @input="updatePlayerPlan($event.target.value)"
          />
          <textarea v-else :value="player.plans" readonly />
        </div>
      </div>
    </section>

    <section class="output">
      <div class="d-flex flex-column">
        <v-btn v-for="(server, index) in serverTabs" 
          :key="server.name" 
          v-text="server.name" 
          :disabled="server.disabled"
          :class="serverTab === index && 'primary--text active-vertical'"
          @click="serverTab = index" />
      </div>
      <!-- <v-tabs v-model="serverTab" vertical>
        <v-tab v-for="(server, index) in serverTabs" :key="server.name" v-text="server.name" :disabled="server.disabled" :value="index" />
      </v-tabs> -->
      <div class="content overflow-auto">
        <pre v-text="serverTabs[serverTab].content" />
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { parseCommands } from '@/quantum-hack/commands'
import { generate } from '@/quantum-hack/report'
import { QuantumServer, Player, Command, Threat } from '@/quantum-hack/types'
import Timer from '@/components/Timer.vue'
import TextCopy from '@/components/TextCopy.vue'
import { formattedTime } from '@/utils/formatTime'

const planDefaults: string[] = [
  'T0: Initial connect',
  'T1: '
]

type Tab = {
  name: string;
  content: string;
  readonly?: boolean;
  disabled?: boolean;
}

export default Vue.extend({
  name: 'Training',
  components: { Timer, TextCopy },
  data() {
    return {
      playerPlans: undefined as undefined | string,
      playerTabsActive: [true] as boolean[],
      serverTab: 0,
    }
  },

  computed: {
    quantumServer(): QuantumServer {
      return this.$store.getters.quantumServer
    },

    startTime(): number {
      const { serverTimeOffset } = this.$store.state.quantumServer
      const { startTime } = this.quantumServer
      if (typeof serverTimeOffset === 'number' && startTime) {
        return Math.round(startTime.seconds - (serverTimeOffset / 1000))
      } 
      return 0
    },

    activeThreats(): Threat[] {
      if (!this.startTime) {
        return []
      }
      return this.quantumServer.threats
    },

    serverTabs(): Tab[] {
      const { welcome_message, scan_result, report } = this.quantumServer
      const initiated = !!this.startTime
      const hasReport = !!report
      let threatText = 'There are currently no threats.'

      const threats = this.activeThreats
      if (threats.length) {
        threatText = threats.map(({ name, description }) => {
          return `### Threat Detected: ${name} ###\n${description}`
        }).join('\n\n')
      }

      return [
        { name: 'Ping', content: welcome_message },
        { name: 'Scan', content: scan_result, disabled: !initiated },
        { name: `Threats (${threats.length})`, content: threatText, disabled: !initiated },
        { name: 'Report', content: report || '', disabled: !hasReport },
      ]
    },

    currentURL(): string {
      return window.location.href
    },

    isHost(): boolean {
      return this.quantumServer.hostId === this.$store.state.user.uid
    },

    activePlayerTabs(): Player[] {
      return (this.quantumServer.players || []).filter((_, index) => {
        return this.playerTabsActive[index];
      })
    },

    playerAI(): Player | undefined {
      const userId: string = this.$store.state.user.uid;
      if (this.quantumServer.players) {
        return this.quantumServer.players.find(player => player.id === userId)
      }
      return undefined;
    },

    playerAICanPlan(): boolean {
      if (!this.playerAI) {
        return false;
      }
      const { plans, completeTime } = this.playerAI;
      return (
        !!this.startTime && // initiated
        plans !== undefined && // Plan has loaded
        !completeTime && // Player hasn't pressed "run"
        !this.quantumServer.report // The run hasn't ended
      )
    },

    playerAIIsLast(): boolean {
      const players = (this.quantumServer.players as Player[])
      return players.every(player => {
        if (player.id === this.playerAI?.id) {
          return !player.completeTime
        }
        return player.completeTime
      })
    }
  },

  methods: {
    playerIsHost(player: Player): boolean {
      return this.quantumServer.hostId === player.id
    },

    addPlayerAI() {
      const plans = 'T00: connect\nT01: '
      const displayName: string = this.$store.state.user.displayName
      this.$store.dispatch('updateServerPlayer', { plans, displayName, joined: Date })
    },

    removePlayerAI() {
      this.$store.dispatch('deleteServerPlayer')
    },

    async initiate() {
      await this.$store.dispatch('initiateServerScan')

      // @ts-ignore
      this.$refs.timer.start()
      this.serverTab = 1 // Switch to 'scan' tab
    },

    togglePlayerTab(index:number) {
      this.$set(this.playerTabsActive, index, !this.playerTabsActive[index])
    },

    updatePlayerPlan(plans: string) {
      this.$store.dispatch('updateServerPlayer', { plans })
    },

    async run() {
      if (!this.playerAI) {
        throw new Error('Unable to run, player is unknown')
      }
      
      // Await to ensure the server is fully updated before generating the report
      await this.$store.dispatch('updateServerPlayer', {
        plans: this.playerPlans,
        completeTime: Date
      })

      if (this.playerAIIsLast) {
        this.createReport(true)
      }
    },

    createReport(success?: boolean) {
      if (!this.playerAI || this.playerPlans === undefined) {
        return
      }
      // @ts-ignore
      const endTime = this.$refs.timer.formattedTime
      const { threats, name } = this.quantumServer

      const players: Player[] = (this.quantumServer.players || []).concat();
      players.sort((a, b): number => {
        return (a.completeTime?.seconds || 0) - (b.completeTime?.seconds || 0)
      });
      const priorities = players.map(player => player.displayName)

      const plansMap: { [displayName: string]: Command[] } = {}
      players.forEach(({ displayName, plans }: Player) => {
        plansMap[displayName] = parseCommands(plans)
      })

      const message = (success
        ? this.quantumServer.finished_success 
        : this.quantumServer.finished_timeout
      )
      
      const AAR = generate(name, plansMap, threats, priorities)
      const report = (message + '\n\n' + AAR).trim()
      this.$store.dispatch('updateQuantumServer', { report, endTime })
    },

    reset() {
      this.playerPlans = planDefaults.join('\n')
      this.updatePlayerPlan(this.playerPlans)
    }
  },

  watch: {
    quantumServer: {
      immediate: true,
      handler(newVal, oldVal = { threats: [] }) {
        if (newVal.report && !oldVal.report) {
          this.serverTab = 3; // Select Report tab
        } else if (newVal.startTime && newVal.threats.length > oldVal.threats.length) {
          this.serverTab = 2; // Select Threats tab
        } else if (newVal.startTime && !oldVal.startTime) {
          this.serverTab = 1; // Select Scan tab
        }
      }
    },

    playerAI: {
      immediate: true,
      handler(newVal, oldVal) {
        if (oldVal || !newVal) {
          return;
        }
        // Set player plans only on initial input;
        // After that the local copy is leading.
        this.playerPlans = newVal.plans
      }
    }
  }
})
</script>

<style lang="scss" scoped>
  .section-container {
    --input-height: 50vh;
    --border-size: 2px;
    --border-color: #555;

    height: calc(100vh - 64px);
    display: flex;
    flex-direction: column;
    section {
      display: flex;

      &.input {
        flex-direction: column;
        height: var(--input-height);
        border-bottom: solid var(--border-color) var(--border-size);
      }
      &.output {
        flex-direction: row;
        height: calc(100% - var(--input-height) - var(--border-size));
      }
      .btn-bar {
        height: 100%;
        margin-right: 4px;  
        .v-btn {
          height: 100%;
        }
      }
    }    
  }

  .v-tabs {
    flex: 0;
  }
  .content {
    flex: 1;
    font-size: 14px;
    position: relative;
    &:nth-child(n+2) {
      border-left: solid var(--border-color) var(--border-size);
    }
    > pre {
      white-space: pre-line;
      padding: 12px;
    }
    > textarea {
      padding: 12px;
      outline: none;
      font-family: monospace;
      color: white;
      resize: none;
      width: 100%;
      height: 100%;
      &:focus {
        background-color: rgba(255,255,255,0.04)
      }
    }
  }
  .overflow-auto {
    overflow: auto;
  }

  .inputBox, .outputBox {
    height: calc(90vh - 160px);
    width:100%;
    background: rgba(0,0,0, 0.8);
    border-radius: 4px;
    padding: 4px;
  }
  .active {
    border-bottom: 2px solid red;
  }
  .active-vertical {
    border-left: 2px solid red;
  }
  .toolbar {
    min-height: 36px;
    background: rgba(255,255,255,0.07);
    box-shadow: inset var(--border-color) 0 -1px 0;
  }
  .urlInput {
    width: 300px;
    border: solid 1px #a00000;
    padding: 4px;
    margin-right: 4px;
  }
  .v-btn {
    border-radius: 0;
    min-height: 36px;
  }
</style>