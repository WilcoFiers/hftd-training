<template>
  <v-card>
    <v-card-text>
    <v-select 
      :items="serverLayoutNames" 
      label="Server layout"
      v-model="server"
    />
    <v-textarea :value="description" rows="8" readonly />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { Server } from '@/qhack/types'

export default Vue.extend({
  name: 'SelectServer',
  mounted() {
    this.$store.dispatch('bindServerLayoutList')
  },
  data() {
    return {
      server: undefined as undefined | string,
      description: '' as string
    }
  },
  computed: {
    serverLayouts(): (Server & { id: string })[] {
      return this.$store.state.hacks.serverLayouts
    },
    serverLayoutNames() {
      // @ts-ignore // Don't know why this is failing, but it is
      return this.serverLayouts.map(({ id, name }) => ({
        text: name,
        value: id
      }))
    }
  },
  watch: {
    server(serverId) {
      if (serverId) {
        const server = this.serverLayouts.find(({ id }) => id === serverId)
        this.description = server?.description || ''
        this.$emit('input', server)
      }
    }
  }
})


</script>