<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="3">
        <v-list>
          <v-list-item-group v-model="current" color="primary">
            <v-list-item>New threat</v-list-item>
            <v-list-item 
              v-for="threat in threats"
              v-text="threat.name"
              :key="threat.id"
              />
          </v-list-item-group>
        </v-list>
      </v-col>
      <v-col>
        <v-form>
          <v-text-field v-model="name" label="Threat name" />
          <v-textarea v-model="description" label="Threat description" rows="3" />
          <v-textarea v-model="plans" label="Threat plan" rows="5" />
          <v-btn @click="saveThreat" class="secondary">
            <v-icon left>mdi-content-save</v-icon>Save
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Threat } from '@/qhack/types'

export default Vue.extend({
  name: 'Threats',
  mounted() {
    this.$store.dispatch('bindThreatList')
  },
  data() {
    return {
      current: 0 as number,
      name: '' as string,
      description: '' as string,
      plans: '' as string
    }
  },

  computed: {
    threats(): Threat[] {
      return this.$store.state.hacks.threats as Threat[]
    }
  },

  watch: {
    current(newCurrent: number, oldCurrent: number) {
      if (newCurrent === oldCurrent) {
        return
      }
      const threat: Threat = this.threats[newCurrent - 1] || { name: '', description: ''}
      this.name = threat.name
      this.description = threat.description
      this.plans = threat.plans || ''
    }
  },

  methods: {
    saveThreat() {
      if (this.current === 0) {
        this.$store.dispatch('createThreat', {
          name: this.name,
          description: this.description,
          plans: this.plans
        })
      } else {
        this.$store.dispatch('updateThreat', {
          // @ts-ignore
          id: this.serverLayouts[this.current-1].id,
          name: this.name,
          description: this.description,
          plans: this.plans
        })
      }
    }
  }
})
</script>

