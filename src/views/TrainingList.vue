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
            :to="`/trainings/${server.serverId}`">
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
  </v-container>    
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'TrainingList',
  data() {
    return {
      trainings: [
        {
          name: 'Beginner Servers',
          servers: [{
              name: 'Beginner, level 1',
              serverId: 'oij32fpajwf3p09j',
              complete: true
            }, {
              name: 'Beginner, level 2',
              serverId: 'f9083j98a3fjponawf3'
            }, {
              name: 'Beginner, level 3',
              serverId: 'p09a82uopijawmx',
              locked: true
            }
          ]
        }
      ]
    }
  }
})
</script>