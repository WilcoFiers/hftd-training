<template>
  <v-app>
    <AppBar />
    <NavigationDrawer />
    <v-content>
      <div class="px-md-4 pt-md-4">
        <slot></slot>
      </div>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import AppBar from "./layout/AppBar.vue";
import NavigationDrawer from "./layout/NavigationDrawer.vue";

export default Vue.extend({
  name: "AppLayout",
  components: {
    AppBar,
    NavigationDrawer
  }
});
</script>
