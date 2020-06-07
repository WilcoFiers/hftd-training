<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>My Hack</v-card-title>
          <v-card-text>
            <pre v-text="hack.aar" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Hack } from '@/qhack/types'

export default Vue.extend({
  name: 'Hack',
  computed: {
    hack(): Hack {
      return this.$store.getters.hack || {}
    },
  }
})
</script>