<template>
  <v-container class="pt-0">
    <v-row>
      <v-col class="pt-0">
        <v-card>
          <v-card-text>
            <v-form ref="form">
              <v-select 
                :items="threatsSelect" 
                label="Add new threat"
                v-model="threatId"
              />
              <v-textarea :value="threatText" readonly rows="4" />
              <v-row>
                <v-col md="4">
                  <v-text-field v-model="startTick" label="Starting tick" type="number" />
                </v-col>
                <v-col md="4">
                  <v-text-field v-model="securitySystem" label="Security system" type="number" />
                </v-col>
                <v-col md="4">
                  <v-text-field v-model="traceRoute" label="traceRoute" hint="Can be 'all' or a number"/>
                </v-col>
              </v-row>
              <v-btn @click="addThreat">Add Threat</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col class="pt-0">
        <v-card>
          <v-card-text>
            <v-list v-if="threats.length">
              <v-list-item 
                v-for="(threat, key) in threats" 
                v-text="`${threat.name}, starts tick ${threat.startTick}`" 
                :key="key"
                @click="removeThreat(key)"
              />
            </v-list>
            <p v-else class="text-center">No threats selected</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Threat } from '@/qhack/types'

export default Vue.extend({
  name: 'SelectThreats',
  mounted() {
    this.$store.dispatch('bindThreatList')
  },
  data() {
    return {
      threatId: '' as string,
      startTick: '' as string,
      securitySystem: '' as string,
      traceRoute: '' as string,
      threatText: '' as string,
      threats: [] as Threat[]
    }
  },

  watch: {
    threatId(threatId) {
      const threat = this.dbThreats.find(({ id }) => id === threatId) as Threat
      this.threatText = threat?.description || ''
      if (threat?.plans) {
        this.threatText += '\n' + threat.plans
      }
    }
  },

  computed: {
    dbThreats(): (Threat & { id: string })[] {
      return this.$store.state.hacks.threats
    },

    threatsSelect() {
      // @ts-ignore // Don't know why this is failing, but it i
      return this.dbThreats.map(({ id, name }) => ({
        text: name,
        value: id
      }))
    },

    form(): { reset: () => {}, validate: () => {} } {
      // @ts-ignore
      return this.$refs.form
    }
  },

  methods: {
    addThreat() {
      if (!this.form.validate()) {
        return
      }
      const dbThreat = this.dbThreats.find(({ id }) => id === this.threatId) as Threat
      const threat: Threat = {
        ...dbThreat,
        startTick: parseInt(this.startTick)
      }

      if (this.securitySystem !== '') {
        threat.securitySystem = parseInt(this.securitySystem)
      }
      if (this.traceRoute !== '') {
        threat.traceRoute = this.traceRoute
      }

      this.$set(this.threats, this.threats.length, threat);

      this.$emit('input', this.threats);
      this.form.reset()
    },

    removeThreat(index: number) {
      this.$delete(this.threats, index);
      this.$emit('input', this.threats);
    }
  }

})
</script>