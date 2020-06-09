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
          <v-textarea v-model="parsed" label="parsed threat" rows="5" readonly />
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
// @ts-ignore
import YAML from 'json-to-pretty-yaml'
import { Threat } from '@/qhack/types'
import threatParser from '@/qhack/parser/threat'

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
    threats(): (Threat & { id: string })[] {
      return this.$store.state.hacks.threats as (Threat & { id: string })[]
    },
    parsed(): string {
      const parsedThreat = threatParser({
        name: this.name,
        description: this.description,
        plans: this.plans,
        startTick: 0,
        traceRoute: '1'
      })
      return YAML.stringify(parsedThreat)
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
          id: this.threats[this.current-1].id,
          name: this.name,
          description: this.description,
          plans: this.plans
        })
      }
    }
  }
})
</script>

