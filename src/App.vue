<template>
  <v-app dark>
    <AppLayout>
      <router-view></router-view>
    </AppLayout>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import AppLayout from "./components/AppLayout.vue";

export default Vue.extend({
  name: "App",

  components: {
    AppLayout
  },

  data: () => ({
    //
  })
});
</script>
