<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Input</v-card-title>
          <v-card-text>
            <div class="inputBox" v-if="!initiated">
              <v-btn @click="initiate">~initiate server scan</v-btn>
            </div>
            <div class="inputBox" v-else>
              <label v-for="tick in ticks" :key="tick.label" class="inputLabel">
                {{tick.label}}:
                <input type="text" v-model="tick.value" />
              </label>
              <v-btn class="mt-3">~run</v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>System Output</v-card-title>
          <v-card-text>
            <textarea readonly v-text="output" class="outputBox" ref="outputBox" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

const startingText = `
Welcome to practice <server> two!
The text you are reading currently is the publicly available text this server gives users that <ping> it.

This server is designed to guide the user into teaching the basics of <Quantum Hacking>.
It is designed to be hacked by 1 hacker, but can be tackled by a team if you prefer to learn together.

After reading these pages you should type "~initiate server scan" to start the hack.

This will initiate a scan of the server so you know what access ports the server has and what <actions> can be taken on those <ports>.

Be careful though! as soon as you initiate the server scan, the system will try and <trace> you.
`.trim()

const scanResults = `
Let’s take a look at an initial scan:

Port 1(1 QPU):
- Initial connect
- Connect to port 2
- Redirect up to 1 QPU from port 1 to port 2
- Add 1 node to Trace Route 1
- Download data

Port 2 (0 QPU):
- Connect to port 1
- Brute Force Tracing System 1, 7 damage, costs 2 QPU linked to port 2
- Link 1 QPU to port 2
- Download data

Nodes in Tracing Route 1: 1/5

At the start of T3 Tracing System 1 becomes active, it requires 7 damage to be destroyed.
At the end of T3 Tracing System 1 traces 1 node
At the end of T5 Tracing System 1 traces 5 nodes
At the start of T4 a Security Log is created in Port 1. If not changed before the start of T9, it will trace you, even if all AI are disconnected.

As you can see there are some things going on. Tracing System 1 is fast but it isn't able to trace through many nodes at the start. Luckily we can add a node to Tracing Route 1 from Port 1, it’ll buy us some time. As you can see, the Brute Force attack from Port 2 is expensive, it costs 2 QPU, one of which we can redirect from Port 1. The other you’ll have to link up. Right now your computer can only link up 1 QPU to this server, but other servers might have a higher capacity and we are also working on some upgrades that you could buy that would make it so you can link more QPU to the target server. Keep earning those BitMint!

Try and think of the solution to this server yourself for now or scroll down for the solution. Your goal is to download the data on both ports! And try and use the new bot commands to input your plan:

If you think you found a solution type ~begin plan to start inputting your plan. If you want to stop inputting stuff into your plan type ~end plan.

If you want to check your current plan simply type ~plan

If you want to run the eventual plan type ~run.
Let’s look at the Plan that will crack this server:
`.trim()

const planDefaults: string[] = [
  'T0: Initial connect',
  'T1: Connect to port 2',
  'T2: Download data',
  'T3: Brute force',
  'T4: Connect to port 1 ',
  'T5: Download data',
  'T6: Edit data',
  'T7: disconnect',
]

type Tick = {
  label: string,
  value: string
}

const ticks: Tick[] = []
for (let i = 0; i < 10; i++) {
  ticks.push({
    label: `t${i}`,
    value: planDefaults[i] || ''
  })
}

export default Vue.extend({
  name: 'Training',
  data() {
    return {
      output: startingText,
      initiated: false,
      ticks
    }
  },

  methods: {
    initiate() {
      this.output += scanResults
      this.initiated = true

      // @ts-ignore
      const outputBox = this.refs.outputBox
      outputBox.scrollTop = outputBox.scrollHeight;
    }
  }
})
</script>

<style lang="scss" scoped>
  .inputBox, .outputBox {
    height: calc(90vh - 160px);
    width:100%;
    background: rgba(0,0,0, 0.8);
    border-radius: 4px;
    padding: 4px;
  }
  .inputBox {
    min-height:140px;
    overflow-y: auto;
    // display: flex;
    // flex-direction: column;
    // justify-content: flex-end;
  }
  .inputLabel {
    display: flex;
    padding: 0 4px 4px;

    input {
      flex: 1;
      background: rgba(255,255,255, 0.2);
      padding: 2px 8px;
      margin-left: 4px;
    }
  }
</style>