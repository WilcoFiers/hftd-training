<template>
  <v-container>
    <v-row v-for="(training, index) in trainings" :key="index+'-training'">
      <v-col cols="12" sm="9" md="8">
        <v-card>
          <v-card-title class="d-flex">
            <h2>{{ training.name }}</h2>
            <v-spacer />
            <v-icon left>mdi-battery-charging-10</v-icon>
          </v-card-title>
          <v-list>
            <v-list-item v-for="(server, index) in training.servers" :key="index"
            @click="newServerModal(server.name)">
              <v-list-item-icon>
                <v-icon v-if="server.locked">mdi-lock</v-icon>
                <v-icon v-else-if="server.complete">mdi-check-bold</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="server.name" />
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="serverSetupDialog" :overlay-opacity="0.7" max-width="600">
      <ServerSetupForm 
        :serverName="serverName"
        @create="createServer($event)"
      />
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import ServerSetupForm from '@/components/ServerSetupForm.vue'
import { QuantumServer } from '@/quantum-hack/types'

export default Vue.extend({
  name: 'TrainingList',
  components: { ServerSetupForm },
  data() {
    return {
      serverSetupDialog: false as boolean,
      serverName: '' as string,
      trainings: [
        {
          name: 'Beginner Servers',
          servers: [{
              name: 'Training Server #1',
              // complete: true
            }, {
              name: 'Training Server #2',
            }, {
              name: 'Training Server #3',
              // locked: true
            }
          ]
        }
      ]
    }
  },

  methods: {
    newServerModal(name: string) {
      this.serverName = name
      this.serverSetupDialog = true;
    },

    async createServer(quantumServer: QuantumServer) {
      const serverId = await this.$store.dispatch('createQuantumServer', quantumServer)
      this.$router.push(`/trainings/${serverId}`)
    }
  }
})
</script>