<template>
  <div>
    <p
      class="error--text"
      v-for="(msgText, i) in messages"
      role="alert"
      :key="i"
    >
      <v-icon class="error--text" small>mdi-alert-circle</v-icon>
      {{ msgText }}
    </p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "ErrorMessage",
  props: {
    message: {
      type: [String, Array]
    }
  },

  computed: {
    messages(): string[] {
      const message = this.message as string | string[];
      if (Array.isArray(message)) {
        return message;
      } else if (message.trim() !== "") {
        return [message];
      } else {
        return [];
      }
    }
  }
});
</script>
