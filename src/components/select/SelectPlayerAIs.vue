<template>
  <v-container class="pt-0">
    <v-row>
      <v-col class="pt-0">
        <v-card>
          <v-card-text>
            <v-text-field label="Player name" v-model="displayName" />
            <v-textarea label="plans" v-model="plans" />
            <v-btn @click="addPlayerAI">Add player</v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col class="pt-0">
        <v-card>
          <v-card-text>
            <v-list v-if="playerAIs.length">
              <v-list-item 
                v-for="(playerAI, key) in playerAIs" 
                v-text="`${key + 1}: ${playerAI.displayName}`" 
                :key="key"
                @click="removePlayerAI(key)"
              />
            </v-list>
            <p v-else class="text-center">Add player AI plans, starting with the AI that runs first</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { PlayerAI } from '@/qhack/types'

export default Vue.extend({
  name: 'SelectPlayerAIs',
  data() {
    return {
      displayName: '' as string,
      plans: '' as string,
      playerAIs: [] as PlayerAI[]
    }
  },

  methods: {
    addPlayerAI() {
      if (!this.displayName || !this.plans) {
        return;
      }
      const newPlayer: PlayerAI = {
        displayName: this.displayName,
        plans: this.plans,
      }
      // reset
      this.displayName = ''
      this.plans = ''
      // update
      this.$set(this.playerAIs, this.playerAIs.length, newPlayer);
      this.$emit('input', this.playerAIs);
    },

    removePlayerAI(index: number) {
      this.$delete(this.playerAIs, index);
      this.$emit('input', this.playerAIs);
    }
  }
})
</script>