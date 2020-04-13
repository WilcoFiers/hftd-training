<template>
  <div>
    <input :value="text" readonly class="urlInput" ref="input" />
    <v-tooltip top>
      <template v-slot:activator="{ on }">
        <v-btn icon title="copy'" v-on="on" @click="copyText"><v-icon v-text="icon"/></v-btn>
      </template>
      <span v-text="tooltip" />
    </v-tooltip>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

type Input = {
  select(): void,
  setSelectionRange(start: number, end: number): void,
}

export default Vue.extend({
  name: 'TextCopy',
  props: {
    text: {
      type: String
    },
    tooltip: {
      type: String,
      default: 'Copy'
    },
    icon: {
      type: String,
      default: 'mdi-clipboard-text-play-outline'
    }
  },
  methods: {
    copyText() {
      const input = this.$refs.input as any as Input
      /* Select the text field */
      input.select();
      input.setSelectionRange(0, 99999); /*For mobile devices*/
      /* Copy the text inside the text field */
      document.execCommand("copy");
    }
  }
})
</script>