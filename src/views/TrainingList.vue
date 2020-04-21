<template>
  <v-container>
    <v-row v-for="(serverGroup, index) in serverGroups" :key="index+'-server'">
      <v-col cols="12" sm="9" md="8">
        <v-card>
          <v-card-title class="d-flex">
            <h2>{{ serverGroup.name }}</h2>
            <v-spacer />
            <v-icon left>mdi-battery-charging-{{ index * 40 + 10}}</v-icon>
          </v-card-title>
          <v-list>
            <v-list-item v-for="(server, index) in serverGroup.servers" :key="index"
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
import serverGroups from '@/quantum-hack/servers'

export default Vue.extend({
  name: 'TrainingList',
  components: { ServerSetupForm },
  data() {
    return {
      serverSetupDialog: false as boolean,
      serverName: '' as string,
      serverGroups
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