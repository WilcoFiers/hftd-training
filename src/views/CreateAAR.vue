<template>
  <v-stepper v-model="step" class="flat transparent">
    <v-stepper-header>
      <v-stepper-step :complete="step > 1" step="1">Server layout</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :complete="step > 2" step="2">Threats</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :complete="step > 3" step="3">AI Plans</v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <!-- Server layout -->
      <v-stepper-content step="1">
        <SelectServer @input="server = $event" />
        <div class="d-flex justify-end mt-6">
          <v-btn color="secondary" @click="step++" :disabled="!server">Continue</v-btn>
        </div>
      </v-stepper-content>

      <!-- Threats -->
      <v-stepper-content step="2">
        <SelectThreats @input="threats = $event" />
        <div class="d-flex justify-space-between mt-6">
          <v-btn text @click="step--">Back</v-btn>
          <v-btn color="secondary" @click="step++">Continue</v-btn>
        </div>
      </v-stepper-content>

      <!-- Players -->
      <v-stepper-content step="3">
        <SelectPlayerAIs @input="playerAIs = $event" />
        <div class="d-flex justify-space-between mt-6">
          <v-btn text @click="step--">Back</v-btn>
          <v-btn color="primary" @click="generateAAR" :disabled="!playerAIs.length" :loading="loading">Generate AAR</v-btn>
        </div>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script lang="ts">
import Vue from 'vue'
import { PlayerAI, Threat, Server } from '@/qhack/types'
import { createAAR, runServerHack } from '@/qhack'

import SelectServer from '@/components/select/SelectServer.vue'
import SelectThreats from '@/components/select/SelectThreats.vue'
import SelectPlayerAIs from '@/components/select/SelectPlayerAIs.vue'

export default Vue.extend({
  name: 'CreateAAR',
  components: { SelectServer, SelectThreats, SelectPlayerAIs },
  data() {
    return {
      step: 1 as number,
      server: undefined as undefined | Server,
      threats: [] as Threat[],
      playerAIs: [] as PlayerAI[],
      loading: false
    }
  },

  methods: {
    async generateAAR() {
      this.loading = true;
      const { server, threats, playerAIs } = this
      const report = runServerHack({ server: server as Server, threats, playerAIs })
      const aar = createAAR(report)

      const hackId = await this.$store.dispatch('createHack', { server, threats, playerAIs, aar })
      this.$router.push(`/hacks/${hackId}`)
    }
  }
})
</script>