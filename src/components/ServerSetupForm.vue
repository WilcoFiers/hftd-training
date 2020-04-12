<template>
  <v-form @submit.prevent="submit" ref="form">
    <v-card>
      <v-card-title>Quantum Server Setup</v-card-title>
      <v-card-text>
        <v-text-field label="Server name" :value="serverName" disabled />
        <p>Beginner servers can be used without cost.</p>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn type="submit" :loading="loading" class="secondary">Create</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script lang="ts">
import Vue from 'vue'
import { getServer } from '@/quantum-hack/server'

export default Vue.extend({
  name: 'ServerSetupForm',
  props: {
    serverName: String,
    loading: Boolean
  },
  data() {
    return {}
  },

  methods: {
    submit() {
      // @ts-ignore
      if (!this.$refs.form.validate()) {
        return;
      }
      this.$emit('create', getServer(this.serverName))
    }
  }
})
</script>