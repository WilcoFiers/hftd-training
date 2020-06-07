<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="3">
        <v-list>
          <v-list-item-group v-model="current" color="primary">
            <v-list-item>New server layout</v-list-item>
            <v-list-item 
              v-for="server in serverLayouts"
              v-text="server.name"
              :key="server.id"
              />
          </v-list-item-group>
        </v-list>
      </v-col>
      <v-col>
        <v-form>
          <v-text-field v-model="name" label="server name" />
          <v-textarea v-model="description" label="server description" rows="10" />
          <v-btn @click="saveServer" class="secondary">
            <v-icon left>mdi-content-save</v-icon>Save
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Server } from '@/qhack/types'

export default Vue.extend({
  name: 'ServerLayout',
  mounted() {
    this.$store.dispatch('bindServerLayoutList')
  },
  data() {
    return {
      current: 0 as number,
      name: '' as string,
      description: '' as string
    }
  },

  computed: {
    serverLayouts(): Server[] {
      return this.$store.state.hacks.serverLayouts as Server[]
    }
  },

  watch: {
    current(newCurrent: number, oldCurrent: number) {
      if (newCurrent === oldCurrent) {
        return
      }
      const server: Server = this.serverLayouts[newCurrent - 1] || { name: '', description: ''}
      this.name = server.name
      this.description = server.description
    }
  },

  methods: {
    saveServer() {
      if (this.current === 0) {
        this.$store.dispatch('createServerLayout', {
          name: this.name,
          description: this.description
        })
      } else {
        this.$store.dispatch('updateServerLayout', {
          // @ts-ignore
          id: this.serverLayouts[this.current-1].id,
          name: this.name,
          description: this.description
        })
      }
    }
  }
})
</script>

