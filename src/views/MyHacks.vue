<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="9" md="8">
        <h1>My Hacks</h1>
      </v-col>
      <v-col cols="12" sm="9" md="8">
        <v-list v-if="myHacks.length">
          <v-list-item v-for="(hack, i) in myHacks" :key="i" :to="`/hacks/${hack.id}`">
            {{hack.server.name}},  {{ formatDate(hack.createdAt.seconds) }}
          </v-list-item>
        </v-list>
        <p v-else>You have no hacks saved</p>
      </v-col>
      <v-col cols="12" sm="9" md="8">
        <p><v-btn to="/create-aar">Create an AAR</v-btn></p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { formatDate } from '@/utils/formatTime'

export default Vue.extend({
  name: 'MyHacks',
  computed: {
    myHacks() {
      return this.$store.state.hacks?.myHacks;
    }
  },

  methods: {
    formatDate
  }
})
</script>