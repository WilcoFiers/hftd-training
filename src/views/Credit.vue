<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="9" md="8">
        <h1>Credits</h1>
        <p>Credits can be used to purchase single-player server simulators, or for setting up simulated servers for Q-hacking with multiple AIs</p>
      </v-col>
      <v-col cols="12" sm="9" md="8">
        <v-card class="text-center">
          <v-card-title>Your current credits</v-card-title>
          <v-card-text>
            <div class="credit" v-text="credit + ' Cr.'" />
            <p>To request additional credits, reach out to <strong>Harambe</strong>.</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'Credit',
  computed: {
    credit(): number {  
      return this.$store.state.user?.userData?.credit || 0;
    }
  }
})
</script>

<style lang="scss" scoped>
  .credit {
    display: inline-block;
    font-size: 28px;
    font-weight: 700;
    border: solid 1px red;
    padding: 1em 3em;
    margin: 1em;
    border-radius: 4px;
  }
</style>