<template>
  <v-app-bar app clipped-left class="secondary">
    <v-app-bar-nav-icon
      @click.stop="toggleDrawer"
      aria-label="Toggle navbar"
    ></v-app-bar-nav-icon>

    <router-link to="/" class="title ml-2 unstyled">
      <v-icon left large>mdi-bacteria-outline</v-icon>HTFD&nbsp;
      <span class="font-weight-light">Server Interface</span>
    </router-link>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import { State } from "@/store";

export default Vue.extend({
  name: "AppBar",

  computed: mapState({
    signedIn: (state: State, _) => state.user.signedIn,
    displayName: (state: State) => state.user.displayName
  }),

  methods: {
    toggleDrawer() {
      this.$root.$emit("toggleDrawer");
    },
    signOut() {
      this.$store.dispatch("signOut");
      this.$router.push("/sign-in");
    }
  }
});
</script>

<style lang="scss">
a.unstyled {
  color: inherit !important;
  text-decoration: none;
}
</style>
